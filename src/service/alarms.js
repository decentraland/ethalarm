const Sequelize = require('sequelize');
const Op = Sequelize.Op
const AlarmModel = require('./../../db/models/alarm.js')
const AlarmSyncStateModel = require('./../../db/models/alarm_sync_state.js')
const AlarmReceiptModel = require('./../../db/models/alarm_receipt.js')

export class AlarmService {
	constructor(sequelize, DataTypes) {
		this._alarm_model = new AlarmModel(sequelize, DataTypes)
		this._alarm_sync_state_model = new AlarmSyncStateModel(sequelize, DataTypes)
		this._alarm_receipt_model = new AlarmReceiptModel(sequelize, DataTypes)

    this._alarm_model.associate({
        AlarmSyncState: this._alarm_sync_state_model,
        AlarmReceipt: this._alarm_receipt_model
      })
    this._alarm_sync_state_model.associate({ Alarm: this._alarm_model })
    this._alarm_receipt_model.associate({ Alarm: this._alarm_model })
	}

	getAlarms(addresses = []) {
    const where = {};
    if(addresses.length) {
      where.address = {
        [ Op.in ]: addresses,
      }
    }

    return this._alarm_model.findAll({
        where: where,
      }).map(function(alarm) {
				alarm.dataValues.abi = JSON.parse(alarm.dataValues.abi)
				return alarm.dataValues
			})
	}

	storeNewAlarm(alarmDescription) {
		// store into the database
		return this._alarm_model.create({
				address: alarmDescription.address,
				abi: alarmDescription.abi,
				event_names: alarmDescription.event_names,
				email: alarmDescription.email,
				url: alarmDescription.url,
				block_confirmations: alarmDescription.block_confirmations,
			})
	}

	mapAddressesToAlarm(addresses = []) {
		return this.getAlarms(addresses).reduce(function(map, obj) {
        if(!map[obj.address]) map[obj.address] = []
        map[obj.address].push(obj)
        return map
			}, {})
	}

	// getReorgSafety() {}

  mapAddressesToLastSync(addresses, default_last_sync) {
    return this._alarm_model.findAll({
        include: [{
            model: this._alarm_sync_state_model,
            // Automagically handles the deleted at flag :)
          }],
        where: {
          address: {
            [Op.in]: addresses,
          }
        }
      }).reduce(function(addrtolastsync, alarm) {
        let last_sync_block = default_last_sync
        if(alarm.AlarmSyncState !== null)
          last_sync_block = alarm.AlarmSyncState.dataValues.last_sync_block

        // Only return the greatest last_block_sync for specified address
        if(addrtolastsync[alarm.dataValues.address] === undefined
            || last_sync_block > addrtolastsync[alarm.dataValues.address])
          addrtolastsync[alarm.dataValues.address] = last_sync_block

        return addrtolastsync
      }, {})
  }

  getReceipt(alarm_id, tx_hash) {
    return this._alarm_receipt_model.findAll({
        where: {
          Alarm_id: alarm_id,
          tx_hash: tx_hash,
        }
      })
  }

  // dispatchNotifications(alarm, event) {
  // }

  storeLastSyncBlock(address, height) {
    return this.getAlarms([address])
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
              .spread((record, created) => {
                  // console.log(record, created)
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
}
