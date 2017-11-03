import { Router } from 'express'

import locations from '../webapp/locations'

export default class FallbackRouter {
  constructor(log, webpack) {
    this.webpack = webpack
    this.log = log
    this.routes = Object.values(locations)
  }
  setupDefault(app) {
    console.log('asdfa')
    app.use(function(err, req, res, next) {
      try {
        console.log('asdf')
        this.log.error(err)
        res.status(400).json(err)
      } catch (e) {
        console.log('asdf')
      }
    })
  }
}
