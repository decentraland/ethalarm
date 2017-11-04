import { Router } from 'express'

export default class ConfirmationRouter {
  constructor(alarmService, confirmationService) {
    this.confirmationService = confirmationService
    this.alarmService = alarmService
  }

  setup(app) {
    app.post('/confirmations/:id', this.confirm)
  }

  get confirm() {
    return (req, res) => buildResponseSchema(this.alarmService.confirmAlarm(req.params.id), res)
  }
}

const buildResponseSchema = (promise, response = {}) => {
  promise
    .then(result => response.json({ ok: true, result }))
    .catch(error => response.status(error === 'not found' ? 404 : 500).json({ ok: false, error }))
}
