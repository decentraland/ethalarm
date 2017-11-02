import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import SocketIO from 'socket.io'
import Webpack from 'webpack'
import WebpackMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import { handleRequest, extractFromReq } from './utils/requestHelpers'
import { getEnv } from './utils/env'
import { dbConnect } from './lib/db'
import * as eth from './lib/eth'

import webpackConfig from '../config/webpack.config'
import webpackMiddlewareConfig from '../config/webpackMiddleware'
import alarms from './routes/alarms'

const app = express()
const server = http.Server(app)
const io = SocketIO(http)
const webpack = Webpack(webpackConfig)



const PORT = getEnv('PORT', 3000)

io.on('connection', () => {
  console.log(`Client connected`)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(WebpackMiddleware(webpack, webpackMiddlewareConfig))
app.use(WebpackHotMiddleware(webpack))

app.use(express.static('./public'))

// setup db
app.use(dbConnect)
<<<<<<< .merge_file_piURo6

=======
/*
app.post('/subscribeToEvents', handleRequest((req, res) => {

    io.emit('subscription', JSON.stringify(req))

    const address = extractFromReq(req, 'address')
    const subscriptionType = 'events'

    db.save({
        address,
        subscriptionType,
        notificationMethod: 'emails'
    })

    eth.subscribe(subscriptionType, address, function(result) {
        console.log(result)
    })
}))
*/
>>>>>>> .merge_file_qmoaRX
// define routes
app.use('/api', alarms)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(400).json(err);
})

server.listen(PORT, function () {
    console.log(`Eventlog Server running on port ${PORT}`)
})

export default server
