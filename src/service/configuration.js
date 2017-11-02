import fs from 'fs'
import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import Webpack from 'webpack'
import WebpackMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import Sequelize from 'sequelize'
import { Log } from 'decentraland-commons'

import webpackDevelopment from '../config/webpack.development.config'
import webpackProduction from '../config/webpack.production.config'
import middlewareProduction from '../config/webpackMiddleware.production'
import middlewareDevelopment from '../config/webpackMiddleware.development'

export const PRODUCTION = 'production'
export const STAGING = 'staging'
export const TESTING = 'testing'
export const DEVELOPMENT = 'development'
export const ENVS = [ PRODUCTION, STAGING, TESTING, DEVELOPMENT ]

export const configLog = new Log('ConfigurationService')

const _modelDir = path.join(__dirname, '..', 'db', 'models')
const _basename = path.basename(_modelDir)
const _onlyJsFiles = file => (file.indexOf('.') !== 0) && (file !== _basename) && (file.slice(-3) === '.js')

function _sequelizeImport(sequelize, classes) {
  return (file) => {
    const model = sequelize.import(path.join(__driname, file))
    classes[model.name] = model
  }
}

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
    const log = new Logger('Server')

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    this.setupWebpack(app)

    this.setupRoutes(app)

    app.use((err, req, res, next) => {
      log.error(err);
      res.status(400).json(err);
    })

    const port = getEnv('PORT', 3000)
    server.listen(port, () => {
      console.log(`EthAlarm server running on port ${port}`)
    })

    return server
  }

  setupWebpack(app) {
    app.use(WebpackMiddleware(webpack, this.middlewareConfiguration))
    app.use(WebpackHotMiddleware(webpack))
  }

  setupRoutes(app) {
    app.use(this.getAlarmRouter())
    app.use(this.getConfirmationRouter())
    app.use(express.static('./public'))
  }

  getAlarmRouter() {
    return new AlarmRouter(this.alarmService)
  }

  getConfirmationRouter() {
    return new ConfirmationRouter(this.confirmationService)
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
      this._emailService = new EmailService(getEnv('EMAIL_CONFIG'))
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
    const config = getEnv('DATABASE_CONNECTION')
    this._sequelize = new Sequelize(config)
    this._classes = {}

    fs.readdirSync(_modelDir)
      .filter(_onlyJsFiles)
      .forEach(_sequelizeImport(this._sequelize, this._classes))

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
