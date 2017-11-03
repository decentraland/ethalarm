import { Op } from 'sequelize'

export default class AlarmService {
  constructor(dispatchService, alarmModel, syncStateModel, receiptModel, configurationService) {
    this.dispatchService = dispatchService
    this.alarmModel = alarmModel
    this.syncStateModel = syncStateModel
    this.receiptModel = receiptModel
    this.configuration = configurationService
  }

  /**
   * Retrieve a list of all alarms
   * @param [where] add restrictions on what alarms to fetch
   */
  getAlarms(where = { id: undefined, addresses: [] }) {
    const internal_where = {}
    if (where.addresses && where.addresses.length) {
      internal_where.address = {
        [Op.in]: where.addresses
      }
    }

    if (where.id) {
      internal_where.id = where.id
    }

    return this.alarmModel
      .findAll({
        where: internal_where
      })
      .map(function(alarm) {
        alarm.dataValues.abi = JSON.parse(alarm.dataValues.abi)
        alarm.dataValues.event_names = alarm.dataValues.event_names.split(',')
        return alarm.dataValues
      })
  }

  storeLastSyncBlock(contract_address, height) {
    return this.alarms
      .getAlarms({ addresses: [contract_address] })
      .then(async results => {
        const sync_states = []

        for (let x = 0; x < results.length; ++x) {
          const alarm = results[x]

          await this._alarm_sync_state_model
            .findOrCreate({
              where: {
                Alarm_id: alarm.id
              },
              defaults: {
                Alarm_id: alarm.id,
                last_sync_block: height
              }
            })
            .spread(async (record, created) => {
              // console.log(record, created)
              // Update the last block sync if it already exists and is lower
              if (!created && height > record.dataValues.last_sync_block) {
                await record.update({
                  last_sync_block: height
                })
              }

              sync_states.push({
                Alarm_id: alarm.id,
                AlarmSyncState: record,
                created: created
              })
            })
        }

        return sync_states
      })
  }


  /**
   * Store an alarm in the databas
   */
  storeNewAlarm(alarmDescription) {
    // store into the database
    return this.alarmModel.create({
      address: alarmDescription.address,
      abi: alarmDescription.abi,
      event_names: alarmDescription.event_names,
      email: alarmDescription.email,
      url: alarmDescription.url,
      block_confirmations: alarmDescription.block_confirmations
    })
  }

  /**
   * Retrieve a map of addresses to all alarms stored in the database
   */
  mapAddressesToAlarm(addresses = []) {
    return this.getAlarms({ addresses: addresses }).reduce(
      function(map, obj) {
        if (!map[obj.address]) map[obj.address] = []
        map[obj.address].push(obj)
        return map
      },
      {}
    )
  }

  /**
   * Configure the maximum amount of reorgs we might expect to happen
   */
  getReorgSafety() {
    return this.configuration.getReorgSafety()
  }

  getContractData(addressToAlarms) {
    return Object.keys(addressToAlarms).map(address => {
      return {
        address,
        abi: addressToAlarms[address][0].abi
      }
    })
  }

  /**
   * Retrieve a mapping of each address, linking to the latest sync
   * stored in the database for that address
   */
  mapAddressesToLastSync(addresses, default_last_sync) {
    return this.alarmModel
      .findAll({
        include: [
          {
            model: this.syncStateModel
            // Automagically handles the deleted at flag :)
          }
        ],
        where: {
          address: {
            [Op.in]: addresses
          }
        }
      })
      .reduce(function(addrtolastsync, alarm) {
        let last_sync_block = default_last_sync
        if (alarm.AlarmSyncState !== null)
          last_sync_block = alarm.AlarmSyncState.dataValues.last_sync_block

        // Only return the greatest last_block_sync for specified address
        if (
          addrtolastsync[alarm.dataValues.address] === undefined ||
          last_sync_block > addrtolastsync[alarm.dataValues.address]
        )
          addrtolastsync[alarm.dataValues.address] = last_sync_block

        return addrtolastsync
      }, {})
  }

  /**
   * Retrieve a receipt from the database
   */
  getReceipt(alarm_id, tx_hash) {
    return this.receiptModel.findAll({
      where: {
        Alarm_id: alarm_id,
        tx_hash: tx_hash
      }
    })
  }

  dispatchNotification(alarm, event) {
    return this.dispatchService.dispath(alarm, event)
  }
}
