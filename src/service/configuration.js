import fs from 'fs'
import path from 'path'

import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import Webpack from 'webpack'
import WebpackMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import Sequelize from 'sequelize'
import { Log, env } from 'decentraland-commons'

import webpackDevelopment from '../config/webpack.development.config'
import webpackProduction from '../config/webpack.production.config'
import middlewareProduction from '../config/webpackMiddleware.production'
import middlewareDevelopment from '../config/webpackMiddleware.development'

// Missing imports:
import AlarmRouter from '../routes/alarm'
import ConfirmationRouter from '../routes/confirmation'
import FallbackRouter from '../routes/fallbak'
//   AlarmService
//   EmailService
//   TemplateService

export const PRODUCTION = 'production'
export const STAGING = 'staging'
export const TESTING = 'testing'
export const DEVELOPMENT = 'development'
export const ENVS = [ PRODUCTION, STAGING, TESTING, DEVELOPMENT ]

export const configLog = new Log('ConfigurationService')

export default class ConfigurationService {
  constructor(environment) {
    if (!ENVS.includes(environment)) {
      configLog.error(`Error initializing: ${environment} is not in ${JSON.stringify(ENVS)}`)
    }
    this.env = environment
  }

  startServer() {
    const app = express()
    const webpack = Webpack(this.webpackConfiguration)
    const log = new Log('Server')

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    this.setupWebpack(app, webpack)

    this.setupRoutes(app)

    const port = env.getEnv('PORT', 3000)
    const server = http.Server(app)
    server.listen(port, () => {
      console.log(`EthAlarm server running on port ${port}`)
    })

    return server
  }

  setupWebpack(app, webpack) {
    app.use(WebpackMiddleware(webpack, this.middlewareConfiguration))
    app.use(WebpackHotMiddleware(webpack))
  }

  setupRoutes(app) {
    app.use(this.alarmRouter.getRouter())
    app.use(this.confirmationRouter.getRouter())
    app.use(this.fallbackRouter.getRouter())
    app.use(express.static('./public'))
  }

  get alarmRouter() {
    return new AlarmRouter(this.alarmService)
  }

  get confirmationRouter() {
    return new ConfirmationRouter(this.confirmationService)
  }

  get fallbackRouter() {
    return new FallbackRouter()
  }

  get webpackConfiguration() {
    if (this.env === PRODUCTION) {
      return webpackProduction
    }
    return webpackDevelopment
  }

  get middlewareConfiguration() {
    if (this.env === PRODUCTION) {
      return middlewareProduction
    }
    return middlewareDevelopment
  }

  get alarmService() {
    if (!this._alarmService) {
      this._alarmService = new AlarmService(this.alarmModel)
    }
    return this._alarmService
  }

  get emailService() {
    if (!this._emailService) {
      this._emailService = new EmailService(env.getEnv('EMAIL_CONFIG'))
    }
    return this._emailService
  }

  get templateService() {
    if (!this._templateService) {
      this._templateService = new TemplateService()
    }
    return this._templateService
  }

  get database() {
    if (!this._database) {
      this.setupDatabase()
    }
    return this._database
  }

  get alarmModel() {
    if (!this._alarmModel) {
      this.setupDatabase()
    }
    return this._alarmModel
  }

  get alarmSyncStateModel() {
    if (!this._alarmSyncStateModel) {
      this.setupDatabase()
    }
    return this._alarmSyncStateModel
  }

  get alarmReceiptModel() {
    if (!this._alarmReceiptModel) {
      this.setupDatabase()
    }
    return this._alarmReceiptModel
  }

  _setupDatabase() {
    const config = env.getEnv('DATABASE_CONNECTION')
    this._sequelize = new Sequelize(config)
    this._classes = {}

    _sequelizeImport(this._sequelize, this._classes)

    this._associateModels()
    this._classes.sequelize = this._sequelize
    this._classes.Sequelize = this._sequelize
  }

  _associateModels() {
    Object.keys(this._classes).forEach(model => {
      if (this._classes[model].associate) {
        this._classes[model].associate(this._classes)
      }
    })
  }
}

function _sequelizeImport(sequelize, classes) {
  const _modelDir = path.join(__dirname, '..', 'db', 'models')
  const _basename = path.basename(_modelDir)
  const _onlyJsFiles = file => (file.indexOf('.') !== 0) && (file !== _basename) && (file.slice(-3) === '.js')

  fs.readdirSync(_modelDir)
    .filter(_onlyJsFiles)
    .forEach(  (file) => {
      const model = sequelize.import(path.join(__dirname, file))
      classes[model.name] = model
    })
}

