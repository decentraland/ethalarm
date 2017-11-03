import { Router } from 'express'

export default class ConfirmationRouter {
  constructor(confirmationService) {
    this.confirmationService = confirmationService
  }

  getRouter() {
    const router = Router()
    router.post('/confirmations/:id', this.confirm)
    return router
  }

  get confirm() {
    return (req, res) => buildResponseSchema(this.confirmationService.confirm(req.params.id), res)
  }
}

const buildResponseSchema = (promise, response = {}) => {
  promise
    .then(result => res.json({ ok: true, result }))
    .catch(error => res.status(error === 'not found' ? 404 : 500).json({ ok: false, error }))
}
