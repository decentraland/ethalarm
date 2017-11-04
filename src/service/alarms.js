import { Op } from 'sequelize'
import uuid from 'uuid'

export default class AlarmService {
  constructor(dispatchService, confirmationService, alarmModel, syncStateModel, receiptModel, configurationService) {
    this.dispatchService = dispatchService
    this.confirmationService = confirmationService
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
    const internalWhere = {
      enabled: true
    }
    if (where.addresses && where.addresses.length) {
      internalWhere.address = {
        [Op.in]: where.addresses
      }
    }

    if (where.id) {
      internalWhere.id = where.id
    }

    return this.alarmModel
      .findAll({
        where: internalWhere
      })
      .map(function(alarm) {
        alarm.dataValues.abi = JSON.parse(alarm.dataValues.abi)
        alarm.dataValues.eventNames = alarm.dataValues.eventNames.split(';')
        return alarm.dataValues
      })
  }

  confirmAlarm(confirmationCode) {
    return this.alarmModel.findOne({ confirmationCode })
      .then(async alarm => {
        alarm.update({
          enabled: true
        })
      })
  }

  storeLastSyncBlock(contractAddress, height) {
    return this.getAlarms({ addresses: [contractAddress] })
      .then(async (results) => {
        return results.map(async (alarm) => await this.syncStateModel
          .findOrCreate({
            where: {
              alarmId: alarm.id
            },
            defaults: {
              alarmId: alarm.id,
              lastSyncBlock: height
            }
          })
          .spread(async (record, created) => {
            // Update the last block sync if it already exists and is lower
            if (!created && height > record.dataValues.lastSyncBlock) {
              await record.update({
                lastSyncBlock: height
              })
            }
          })
        )
    })
  }

  /**
   * Store an alarm in the databas
   */
  async storeNewAlarm(alarmDescription) {
    // store into the database
    let enabled = !alarmDescription.email
    let confirmationCode = !enabled && uuid.v4()
    try {
      const result = await this.alarmModel.create({
        address: alarmDescription.address.toLowerCase(),
        abi: alarmDescription.abi,
        eventNames: alarmDescription.eventNames,
        email: alarmDescription.email,
        webhook: alarmDescription.webhook,
        blockConfirmations: alarmDescription.blockConfirmations,
        enabled,
        confirmationCode
      })
      if (!enabled) {
        this.confirmationService.sendConfirmationEmail(result)
      }
      return result
    } catch (error) {
      console.log('*********************************************')
      console.log(error.stack)
      console.log('*********************************************')
    }
  }

  destroyAlarm(alarmId) {
    return this.alarmModel.destroy({ where: { id: alarmId } })
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

  mapByTransactionId(events) {
    const result = {}
    for (let event of events) {
      result[event.transactionHash] = result[event.transactionHash] || []
      result[event.transactionHash].push(event)
    }
    return Object.values(result)
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
  mapAddressesToLastSync(addresses, defaultLastSync) {
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
      .reduce(function(result, alarm) {
        let lastSyncBlock = defaultLastSync
        if (alarm.AlarmSyncState !== null)
          lastSyncBlock = alarm.AlarmSyncState.dataValues.lastSyncBlock

        // Only return the greatest lastBlockSync for specified address
        if (
          result[alarm.dataValues.address] === undefined ||
          lastSyncBlock > result[alarm.dataValues.address]
        )
          result[alarm.dataValues.address] = lastSyncBlock

        return result
      }, {})
  }

  /**
   * Retrieve a receipt from the database
   */
  getReceipt(alarmId, txHash) {
    return this.receiptModel.findAll({
      where: {
        alarmId: alarmId,
        txHash: txHash
      }
    })
  }

  dispatchNotification(alarm, event) {
    return this.dispatchService.dispatch(alarm, event)
  }
}
