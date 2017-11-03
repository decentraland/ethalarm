import path from 'path'
import { Router } from 'express'

import locations from '../webapp/locations'

export default class FallbackRouter {
  constructor(log, webpack) {
    this.webpack = webpack
    this.log = log
    this.routes = Object.values(locations)
  }
  setupDefault(app) {
    app.use((req, res, next) => {
      if (!this.routes.includes(req.path)) {
        this.log.warn(`Route ${req.path} not found`)
      }
      const filename = path.join(this.webpack.outputPath, 'index.html')
      this.webpack.outputFileSystem.readFile(filename, (err, result) => {
        if (err) {
          return next(err)
        }
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
      })
    })
    app.use((error, req, res, next) => {
      this.log.error(error)
      res.status(500).json(error)
    })
  }
}
