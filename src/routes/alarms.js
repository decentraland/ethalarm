import { Router } from 'express'
import { Validator } from 'express-json-validator-middleware'

import AlarmSchema from '../schemas/alarms'

const validator = new Validator({ allErrors: true })
const validate = validator.validate.bind(validator)

export default class AlarmRouter {
  constructor(alarmService) {
    this.alarm = alarmService
  }

  setupRouter(app) {
    const router = Router()
    router.post('/alarms', validate({ body: AlarmSchema }), this.postAlarm)
    router.get('/alarms', validate({ body: AlarmSchema }), this.getAlarm)
    router.delete('/alarms', validate({ body: AlarmSchema }), this.deleteAlarm)
  }

  get postAlarm() {
    return (req, res) => {
      this.alarm
        .build(req.body)
        .save()
        .then(alarm => {
          res.status(200).json(buildResponseSchema({ result: { id: alarm.id } }))
        })
        .catch(err => {
          res.status(500).json(buildResponseSchema({ ok: false, error: err }))
        })
    }
  }

  get getAlarm() {
    return (req, res) => {
      this.alarm
        .findById(req.params.id)
        .then(alarm => {
          if (!alarm) throw new Error(`Alarm ${req.params.id} not found`)
          res.status(200).json(getResponseSchema({ alarm }))
        })
        .catch(err => {
          res.status(404).json(
            getResponseSchema({
              ok: false,
              error: err
            })
          )
        })
    }
  }

  get deleteAlarm() {
    return (req, res) => {
      this.alarm
        .destroy({
            where: { id: req.params.id }
        })
        .then(result => {
          res.json(200)
        })
        .catch(err => {
          res.json(500).json(
            getResponseSchema({
              ok: false,
              error: err
            })
          )
        })
    }
  }
}

const buildResponseSchema = (response = {}) => {
  return {
    ok: response.ok || true,
    error: response.error || '',
    result: response.result || {}
  }
}
