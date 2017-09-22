import express from 'express'
import bodyParser from 'body-parser'

import { handleRequest, extractFromReq } from './utils/requestHelpers'
import db from './lib/db'
import * as eth from './lib/eth'

const app = express()

const PORT = process.env.PORT || 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.post('/subscribeToEvents', handleRequest((req, res) => {
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


app.listen(PORT, function () {
  console.log('Server running on port', PORT)
})
