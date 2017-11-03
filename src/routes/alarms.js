import { Router } from 'express'
import { Validator } from 'express-json-validator-middleware'

import AlarmSchema from '../schemas/alarms'

const validator = new Validator({ allErrors: true })
const validate = validator.validate.bind(validator)

export default class AlarmRouter {
  constructor(alarmService) {
    this.alarm = alarmService
  }

  getRouter() {
    const router = Router()
    router.post('/alarms', validate({ body: AlarmSchema }), this.postAlarm)
    router.get('/alarms/:id', this.getAlarm)
    router.delete('/alarms/:id', this.deleteAlarm)
    return router
  }

  get postAlarm() {
    return (req, res) => buildResponseSchema(this.alarm.storeNewAlarm(req.body), res)
  }

  get getAlarm() {
    return (req, res) => {
      buildResponseSchema(this.alarm.getAlarm.findById(req.params.id)
        .then(alarm => {
          if (!alarm) throw new Error('not found')
          return alarm
        }), res)
    }
  }

  get deleteAlarm() {
    return (req, res) => buildResponseSchema(this.alarm.destroy({ where: { id: req.params.id } }), res)
  }
}

const buildResponseSchema = (promise, response = {}) => {
  promise
    .then(result => response.json({ ok: true, result }))
    .catch(error => response.status(error === 'not found' ? 404 : 500).json({ ok: false, error }))
}
