import { Op } from 'sequelize'

export class AlarmService {
  constructor(dispathService, alarmModel, syncStateModel, receiptModel, configurationService) {
    this.dispathService = dispathService
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
    return this.reorgSafety
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
  getReceipt(alarm_id, tx_hash, event_name) {
    return this.receiptModel.findAll({
      where: {
        Alarm_id: alarm_id,
        tx_hash: tx_hash,
        event_name: event_name
      }
    })
  }
}
