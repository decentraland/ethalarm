const Sequelize = require('sequelize')
// const Op = Sequelize.Op
const AlarmSyncStateModel = require('./../../db/models/alarm_sync_state.js')

// function selectLargestConfirmation(maximum, alarm) {
//   if (maximum < alarm.confirmations) {
//     return alarm.confirmations
//   }
//   return maximum
// }

export class EventService {
  constructor(sequelize, DataTypes, alarms) {
    this._alarm_sync_state_model = new AlarmSyncStateModel(sequelize, Sequelize)
    this.alarms = alarms
    this.events = {}
    this.watching = {}
  }

  addSeen(contract_event) {
    const contract_address = contract_event.address
    const event_name = contract_event.event
    const tx_hash = contract_event.transactionHash
    const block_number = contract_event.blockNumber

    return this.alarms.getAlarms({ addresses: [ contract_address ] })
      // Get the alarms that match the contract_address and event_name
      .then((results) => {
          return results.filter((alarm) => {
              return alarm.event_names.includes(event_name)
            })
        })
      // Add/update the events in this.events if there are alarms without a receipt watching for it
      // Also add them to the array of touched events (whether updated or created)
      .then(async (results) => {
          const touched = []

          // For each event without a receipt, add it to this.events
          for(let x = 0; x < results.length; ++x) {
            const alarm = results[x]

            const receipts = await this.alarms.getReceipt(alarm.id, tx_hash, event_name)
            if(!receipts.length) {
              if(!this.events[contract_address]) this.events[contract_address] = []

              // If this event transaction already exists, simply update the block_height
              let event_to_add = this.events[contract_address].filter((cur_event) => {
                  return (cur_event.tx_hash === tx_hash
                    && cur_event.event_name === event_name
                    && cur_event.address === contract_address)
                })[0]
              if(event_to_add) {
                if(block_number > event_to_add.block_height) {
                  event_to_add.block_height = block_number
                }
              } else {
                event_to_add = {
                  address: contract_address,
                  event_name: event_name,
                  block_height: block_number,
                  tx_hash: tx_hash,
                }
                this.events[contract_address].push(event_to_add)
              }

              // Only add unique touched to the returned data
              if(!touched.some((touched_event) => { return touched_event === event_to_add }))
                touched.push(event_to_add)
            }
          }

          return touched
        })
      // Store the last_sync_block for this contract
      .then((results) => {
          this.storeLastSyncBlock(contract_address, block_number)
          return results
        })
  }

  getLastSyncBlock() {
    return this._alarm_sync_state_model.findAll({
        order: [
          ['last_sync_block', 'DESC']
        ],
        limit: 1,
      }).then((results) => {
          return results[0].last_sync_block
        })
  }

  storeLastSyncBlock(contract_address, height) {
    return this.alarms.getAlarms({ addresses: [contract_address] })
      .then(async (results) => {
          const sync_states = []

          for(let x = 0; x < results.length; ++x) {
            const alarm = results[x]

            await this._alarm_sync_state_model
              .findOrCreate({
                where: {
                  Alarm_id: alarm.id,
                },
                defaults: {
                  Alarm_id: alarm.id,
                  last_sync_block: height,
                }
              })
              .spread(async (record, created) => {
                  // console.log(record, created)
                  // Update the last block sync if it already exists and is lower
                  if(!created && height > record.dataValues.last_sync_block) {
                    await record.update({
                        last_sync_block: height,
                      })
                  }

                  sync_states.push({
                      Alarm_id: alarm.id,
                      AlarmSyncState: record,
                      created: created,
                    })
                })
          }

          return sync_states
        })
  }

  async watchEvents(web3, address, abi, event_names) {
    const my_contract = web3.eth.contract(abi)
    const my_contract_instance = my_contract.at(address)

    if(!this.watching[address]) this.watching[address] = {}

    for(let x = 0; x < event_names.length; ++x) {
      if(!Object.keys(this.watching[address]).includes(event_names[x])) {
        const my_event = my_contract_instance[event_names[x]]({})
        this.watching[address][event_names[x]] = my_event.watch((error, result) => {
            if(!error) {
              this.addSeen(result)
            }
          })
      }
    }
  }

  async watchNewEvents(web3) {
    // watchers = {
    //   '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819': {
    //     event_names = [],
    //     watcher: EventEmiiter
    //   }
    // }

    // Get unique contract address and event_names from alarms
    let alarms = await this.alarms.getAlarms()
    let contracts = {}
    alarms.reduce((contracts, alarm) => {
        if(!contracts[alarm.address]) {
          contracts[alarm.address] = {
            alarm: alarm,
            event_names: alarm.event_names,
          }
        } else {
          const c_event_names = contracts[alarm.address].event_names
          Array.prototype.push.apply(c_event_names, alarm.event_names.filter((name) => {
                return !c_event_names.includes(name)
              }))
        }
        return contracts
      }, contracts)

    // Get event addresses that have additional event_names to watch
    const to_watch = Object.keys(contracts).filter((address) => {
        return !this.watching[address] || Object.keys(this.watching[address]).filter((event_name) => {
            return !Object.keys(this.watching[address]).includes(event_name)
          }).length
      })

    // Start watchers
    to_watch.forEach((address) => {
        // console.log(contracts[address].alarm)
        const abi = contracts[address].alarm.abi
        const event_names = contracts[address].event_names
        this.watchEvents(web3, address, abi, event_names)
      })

    // console.log(to_watch)
  }

  isAlarmTriggered(alarm, event, currentBlockHeight) {
    // if (event.removed) {
    //   return false
    // }
    const confirmations = currentBlockHeight - event.block_height
    return confirmations >= alarm.confirmations
  }

  async getAlarmsToTrigger(currentBlockHeight) {
    const alarms_to_trigger = []

    for(let address in this.events) {
      for(let x = 0; x < this.events[address].length; ++x) {
        const event = this.events[address][x]
        const alarms = (await this.alarms.getAlarms({ addresses: [ address ] }))
          .filter((alarm) => {
              return alarm.event_names.includes(event.event_name)
            })

        const new_triggers = []
        let receipt_count = 0

        for(let y = 0; y < alarms.length; ++y) {
          const alarm = alarms[y]

          const blocks_passed = (event.block_height <= currentBlockHeight - (alarm.block_confirmations-1))
          if(!blocks_passed) continue

          const receipt = await this.alarms.getReceipt(alarm.id, event.tx_hash, event.event_name)
          if(receipt.length) {
            receipt_count++
            continue
          }

          alarms_to_trigger.push({ alarm: alarm, event: event })
        }

        // If we have receipts for all the events, remove the event
        if(receipt_count === alarms.length) {
          this.events[address].splice(x--,1)
        }

        Array.prototype.push.apply(alarms_to_trigger, new_triggers)
      }
    }

    return alarms_to_trigger
  }

  // Clear events from local array which have alarms but also have a receipt OR have no alarms
  // TODO: Untested
  async clearStaleEvents() {
    const addresses = Object.keys(this.events)
    const alarms = await this.alarms.getAlarms({ addresses: addresses })

    // Delete events without alarms waiting
    addresses.filter((address) => {
        return !alarms.some((alarm) => {
            alarm.address === address
          })
      })
      .forEach((address) => {
        delete this.events[address]
      })

    // Delete events which all receipts have already been issued
    // TODO
  }
}

