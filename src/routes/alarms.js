import { Router } from 'express'
import { Validator } from 'express-json-validator-middleware'

import AlarmSchema from '../schemas/alarms'
import Alarm from '../models/alarm'

const router = Router()
const validator = new Validator({ allErrors: true })
const validate = validator.validate.bind(validator)

const getResponseSchema = (response = {}) => {
  return {
    ok: response.ok || true,
    error: response.error || '',
    result: response.result || {}
  }
}

router.post('/alarms', validate({ body: AlarmSchema }), (req, res) => {
  Alarm
    .build(req.body)
    .save()
    .then(alarm => {
      console.log('Document Inserted OK')

      res.status(200).json(
        getResponseSchema({
          result: {
            id: alarm.id
          }
        })
      )
    })
    .catch(err => {
      res.status(500).json(
        getResponseSchema({
          ok: false,
          error: err
        })
      )
    })
})

router.get('/alarms/:id', (req, res) => {
  Alarm
    .findById(req.params.id)
    .then(alarm => {
      if (!alarm) return Promise.reject(alarm)
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
})

router.delete('/alarms/:id', (req, res) => {
    Alarm
    .destroy({
        where: { id: req.params.id }
    })
    .then(result => {
      console.log('Alarm removed from database')
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
})

export default router
