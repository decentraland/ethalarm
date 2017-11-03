import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import Webpack from 'webpack'
import WebpackMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import { Log, env } from 'decentraland-commons'

import AlarmRouter from '../routes/alarms'
import ConfirmationRouter from '../routes/confirmations'
import FallbackRouter from '../routes/fallback'

import AlarmService from '../service/alarms'

import db from '../db/models'

// Missing imports:
//   EmailService
//   TemplateService
//   DispatchService

export const PRODUCTION = 'production'
export const STAGING = 'staging'
export const TESTING = 'testing'
export const DEVELOPMENT = 'development'
export const ENVS = [ PRODUCTION, STAGING, TESTING, DEVELOPMENT ]

export const configLog = new Log('ConfigurationService')

export default class ConfigurationService {
  constructor(envName) {
    if (!ENVS.includes(envName)) {
      configLog.error(`Error initializing: ${envName} is not in ${JSON.stringify(ENVS)}`)
    }
    this.envName = envName

    env.load()
  }

  startServer() {
    const app = express()
    this.webpack = Webpack(this.webpackConfiguration)
    this.serverLog = new Log('Server')

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    this.setupWebpack(app, this.webpack)

    this.setupRoutes(app)

    const port = env.get('PORT', 3000)
    app.listen(port, () => {
      this.serverLog.info(`EthAlarm server running on port ${port}`)
    })

    return app
  }

  setupWebpack(app, webpack) {
    app.use(WebpackMiddleware(webpack, this.middlewareConfiguration))
    app.use(WebpackHotMiddleware(webpack))
  }

  setupRoutes(app) {
    this.alarmRouter.setup(app)
    this.confirmationRouter.setup(app)
    app.use(express.static('./public'))

    this.fallbackRouter.setupDefault(app)
  }

  getReorgSafety() {
    return env.get('REORG_SAFETY', 6)
  }

  get alarmRouter() {
    return new AlarmRouter(this.alarmService)
  }

  get confirmationRouter() {
    return new ConfirmationRouter(this.confirmationService)
  }

  get fallbackRouter() {
    return new FallbackRouter(this.serverLog, this.webpack)
  }

  get webpackConfiguration() {
    const environment = this.envName === PRODUCTION ? PRODUCTION : DEVELOPMENT
    const configPath = `../config/webpack.${environment}.config.js`

    return require(configPath).default
  }

  get middlewareConfiguration() {
    return require('../config/webpackMiddleware.js').default
  }

  get alarmService() {
    if (!this._alarmService) {
      this._alarmService = new AlarmService(
        this.dispatchService,
        this.alarmModel,
        this.syncStateModel,
        this.receiptModel,
        this
      )
    }
    return this._alarmService
  }

  get emailService() {
    throw new Error('Missing EmailService import')
    // if (!this._emailService) {
    //   this._emailService = new EmailService(env.get('EMAIL_CONFIG'))
    // }
    // return this._emailService
  }

  get templateService() {
    throw new Error('Missing TemplateService import')
  }

  get dispathService() {
    throw new Error('Missing DispatchService import')
  }

  get database() {
    return db
  }

  get alarmModel() {
    return db.Alarm
  }

  get alarmSyncStateModel() {
    return db.AlarmSyncState
  }

  get alarmReceiptModel() {
    return db.AlarmRecepeit
  }
}

