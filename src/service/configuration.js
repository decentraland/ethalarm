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
import ConfirmationService from '../service/confirmation'
import EthereumService from '../service/eth'
import ScannerService from '../service/scanner'

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
      this.serverLog.info(`Ethalarm server running on port ${port}`)
    })

    return app
  }

  async startWatching() {
    await this.ethereumService.initialize()
    this.scannerService.run()
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
    return new ConfirmationRouter(this.alarmService, this.confirmationService)
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

  get ethereumService() {
    if (!this._ethereum) {
      this._ethereum = new EthereumService(env.get('ETHEREUM_PROVIDER', 'ws://localhost:8546'))
    }
    return this._ethereum
  }

  get scannerService() {
    if (!this._scanner) {
      this._scanner = new ScannerService(this.alarmService, this.ethereumService)
    }
    return this._scanner
  }

  get alarmService() {
    if (!this._alarmService) {
      this._alarmService = new AlarmService(
        this.dispatchService,
        this.confirmationService,
        this.alarmModel,
        this.syncStateModel,
        this.receiptModel,
        this
      )
    }
    return this._alarmService
  }

  get confirmationService() {
    if (!this._confirmation) {
      this._confirmation = new ConfirmationService(this.emailService, 'confirmation')
      this._confirmation.setupTemplate()
    }
    return this._confirmation
  }

  get emailService() {
    if (!this._email) {
      this._email = new SMTP({
        hostname: env.get('EMAIL_HOSTNAME'),
        port: env.get('EMAIL_PORT'),
        username: env.get('EMAIL_USERNAME'),
        password: env.get('EMAIL_PASSWORD'),
      })
      this.setupNotificationTemplate()
    }
    return this._email
  }

  setupNotificationTemplate() {
    this.emailService.setTemplate('notification', (opts) => {
      const alarmId = opts.alarm.id
      const events = opts.events
      const email = opts.alarm.email
      const address = opts.alarm.address
      const eventNumber = opts.events.length
      const blockNumber = opts.events[0].blockNumber
      const transactionHash = opts.events[0].transactionHash
      const infoUrl = `https://ethalarm.colu.com/info/${alarmId}`
      const unsubscribeUrl = `https://ethalarm.colu.com/unsubscribe/${alarmId}`
      const formatPrePost = (pre, post, items) => pre + items.join(post + pre) + post
      const formatEvent = event => {
        const abiEventMatches = opts.alarm.abi.filter(
          abiEntry => abiEntry.type === 'event' && abiEntry.name === event.event
        )
        if (!abiEventMatches.length) {
          return '(Mismatched ABI Event): ' + event.event + JSON.stringify(event.returnValues)
        }
        const abiEvent = abiEventMatches[0]
        return `${abiEvent.name} (${abiEvent.inputs.map(
          input => `${input.name} [${input.type}]: ${event.returnValues[input.name]}`
        ).join(', ')})`
      }

      const text = `Hello ${email},

We detected ${ eventNumber > 1 ? 'new events' : 'a new event'} regarding the contract ${address} at block ${blockNumber}. The transaction that triggered these events has the hash ${transactionHash}. Here's a summary of the event${ eventNumber > 1 ? 's' : ''}:

${formatPrePost('  - ', '\n', events.map(event => formatEvent(event)))}

You can check the details of the alarm you have set up here:

  ${infoUrl}

Best,
The Colu Team

---
If you would like to stop receiving notifications for this alarm, please visit ${unsubscribeUrl}
`
      const blockUrl = `<a href="https://etherscan.io/block/${blockNumber}">${blockNumber}</a>`
      const transactionUrl = `<a href="https://etherscan.io/tx/${transactionHash}">${transactionHash}</a>`
      const html = `<p>Hello ${email},</p>

<p>We detected ${ eventNumber > 1 ? 'new events' : 'a new event'} regarding the contract ${address} at block ${blockUrl}. The transaction that triggered these events has the hash ${transactionUrl}. Here's a summary of the event${ eventNumber > 1 ? 's' : ''}:</p>

<ul>
${formatPrePost('<li>', '</li>', events.map(event => formatEvent(event)))}
</ul>

<p>You can check the details of the alarm you have set up here:</p>

<div style="margin-left: 20px">${infoUrl}</div>

<p>Best,<br/>
The Colu Team</p>

<p style="font-size: 8px">If you would like to stop receiving notifications for this alarm, please visit ${unsubscribeUrl}</p>
`

      return {
        from: `"The Colu Team" <system@colu.com>`,
        to: opts.alarm.email,
        subject: `[EthAlarm] New Event in Contract ${opts.alarm.address}`,
        text: text,
        html: html
      }
    })
  }

  get dispatchService() {
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

  async startDatabase() {
    return await db.sequelize.sync()
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

