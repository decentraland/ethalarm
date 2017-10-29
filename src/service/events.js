const Sequelize = require('sequelize');
const Op = Sequelize.Op
const AlarmSyncStateModel = require('./../../db/models/alarm_sync_state.js')

function selectLargestConfirmation(maximum, alarm) {
  if (maximum < alarm.confirmations) {
    return alarm.confirmations
  }
  return maximum
}

export class EventService {
  constructor(sequelize, DataTypes, alarms) {
    this._alarm_sync_state_model = new AlarmSyncStateModel(sequelize, Sequelize)
    this.alarms = alarms
    this.events = {}
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
              const watched_events = alarm.event_names.split(',')
              return watched_events.includes(event_name)
            })
        })
      // Add/update the events in this.events if there are alarms without a receipt watching for it
      // Also add them to the array of touched events (whether updated or created)
      .then(async (results) => {
          const touched = []

          // For each event without a receipt, add it to this.events
          for(let x = 0; x < results.length; ++x) {
            const alarm = results[x];

            const receipts = await this.alarms.getReceipt(alarm.id, tx_hash, event_name);
            if(!receipts.length) {
              if(!this.events[contract_address]) this.events[contract_address] = []

              // If this event transaction already exists, simply update the block_height
              let event_to_add = this.events[contract_address].filter((cur_event) => {
                  return cur_event.tx_hash === tx_hash && cur_event.event_name === event_name
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
                touched.push(event_to_add);
            }
          }

          return touched
        })
      // Store the last_sync_block for this contract
      .then((results) => {
          this.storeLastSyncBlock(contract_address, block_number)
          return results;
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
            const alarm = results[x];

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

  isAlarmTriggered(alarm, event, currentBlockHeight) {
    // if (event.removed) {
    //   return false
    // }
    const confirmations = currentBlockHeight - event.block_height
    return confirmations >= alarm.confirmations
  }

  // Clear events from local array which have alarms but also have a receipt OR have no alarms
  // TODO: Untested
  async clearStaleEvents() {
    const addresses = Objecy.keys(this.events)
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

