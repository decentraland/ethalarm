const Sequelize = require('sequelize')
const Op = Sequelize.Op
const fetch = require('node-fetch')
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

	getAlarms(where = { id: undefined, addresses: [] }) {
    const internal_where = {}
    if(where.addresses && where.addresses.length) {
      internal_where.address = {
        [ Op.in ]: where.addresses,
      }
    }

    if(where.id) {
      internal_where.id = where.id
    }

    return this._alarm_model.findAll({
        where: internal_where,
      }).map(function(alarm) {
				alarm.dataValues.abi = JSON.parse(alarm.dataValues.abi)
        alarm.dataValues.event_names = alarm.dataValues.event_names.split(',')
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
		return this.getAlarms({addresses: addresses}).reduce(function(map, obj) {
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

  getReceipt(alarm_id, tx_hash, event_name) {
    return this._alarm_receipt_model.findAll({
        where: {
          Alarm_id: alarm_id,
          tx_hash: tx_hash,
          event_name: event_name,
        }
      })
  }

  async storeReceipt(alarm_id, tx_hash, event_name, extra) {
    const alarm_receipt = {
      Alarm_id: alarm_id,
      tx_hash: tx_hash,
      event_name: event_name,
      http_response: extra.http_response,
      smtp_response: extra.smtp_response,
    }

    return this._alarm_receipt_model.create(alarm_receipt)
  }

  async dispatchNotifications(alarm, event) {
    // if(alarm.email && alarm.email.length) {

    // }

    if(alarm.url && alarm.url.length) {
      await fetch(alarm.url, {
          method: 'POST',
          body: 'details='+JSON.stringify({ alarm: alarm, event: event, }),
          headers: { 'Content-type': 'application/x-www-form-urlencoded' }
        }).then(async (res) => {
          return await res.text()
        }).then(async (text) => {
          await this.storeReceipt(alarm.id, event.tx_hash, event.event_name, { http_response: text })
        })
    }
  }
}
