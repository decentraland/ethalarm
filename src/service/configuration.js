import express from 'express'
import bodyParser from 'body-parser'
import Webpack from 'webpack'
import WebpackMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import { Log, env, SMTP } from 'decentraland-commons'

import AlarmRouter from '../routes/alarms'
import ConfirmationRouter from '../routes/confirmations'
import FallbackRouter from '../routes/fallback'

import AlarmService from '../service/alarms'

import db from '../db/models'

import HTTPService from './http'
import DispatchService from './dispatch'

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
    if (!this._email) {
      this._email = new SMTP({
        hostname: env.get('EMAIL_HOSTNAME'),
        port: env.get('EMAIL_PORT'),
        username: env.get('EMAIL_USERNAME'),
        password: env.get('EMAIL_PASSWORD'),
      })
      this._email.setTemplate('notification', (opts) => ({
        from: `The Decentraland Team <${opts.sender}>`,
        to: `The Decentraland Team <${opts.sender}>`,
        subject: `The Decentraland Team <${opts.sender}>`,
        text: `The Decentraland Team <${opts.sender}>`,
      }))
    }
    return this._email
  }

  get dispathService() {
    if (!this._dispatch) {
      this._dispatch = new DispatchService(this.httpService, this.emailService, 'notification', this.receiptModel)
    }
    return this._dispatch
  }

  get httpService() {
    if (!this._http) {
      this._http = new HTTPService()
    }
    return this._http
  }

  get database() {
    return db
  }

  get alarmModel() {
    return db.Alarm
  }

  get syncStateModel() {
    return db.AlarmSyncState
  }

  get receiptModel() {
    return db.AlarmReceipt
  }
}

