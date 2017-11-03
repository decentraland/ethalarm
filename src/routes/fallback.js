import { Router } from 'express'

import locations from '../webapp/locations'

export default class FallbackRouter {
  constructor(webpack) {
    this.webpack = webpack
    this.routes = Object.values(locations)
  }
  getRouter() {
    const router = Router()
    router.use((err, req, res, next) => {
      if (this.routes.includes(req.path)) {
        res.redirect('/')
      } else {
        next()
      }
    })
    router.use((err, req, res, next) => {
      log.error(err)
      res.status(400).json(err)
    })
    return router
  }
}
