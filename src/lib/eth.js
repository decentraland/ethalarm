import Web3 from 'web3'

import * as env from '../utils/env'


const wsProvider = env.getWeb3WebSocketProvider()

if (! wsProvider.startsWith('ws://')) {
  throw new Error(`
You need to use a WebSocket URL to subscribe to new events. For example, running geth with

  geth -dev --ws --wsport 8545 --wsaddr 0.0.0.0 --wsorigins "*" --wsapi "eth,web3" --minerthreads "1" --etherbase "fdfgfd" -mine

and using "ws://localhost:8545" as URL. You tried to use ${wsProvider}
`)
}

console.log(`Starting web3 with ${wsProvider} as a provider`)
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(wsProvider)
)


const subscription = {
  events(address, callback) {
    const subscription = web3.eth.subscribe('logs', {
        address,
        // topics - Array: An array of values which must each appear in the log entries.
        // The order is important, if you want to leave topics out use null, e.g. [null, '0x00...'].
        topics: [null]
    }, error => {
      if (error) throw new Error(error)
    })

    /*
      data - returns Object: Fires on each incoming log with the log object as argument.
      changed - returns Object: Fires on each log which was removed from the blockchain. The log will have the additional property "removed: true".
      error - returns Object: Fires when an error in the subscription occours.
    */

    subscription.on('data', (log) => {
      console.log(`[${address}] New log from data callback`, log)
      callback(log)
    })

    subscription.on('changed', (log) => {
      console.log(`[${address}] New log from changed callback`, log)
      // callback(log)
    })

    subscription.on('error', (error) => {
      if (error) throw new Error(error)
    })

    return subscription
  }
}

const SUBSCRIPTION_TYPES = Object.keys(subscription)


export function subscribe(type, address, callback) {
  console.log(`Subscribing to ${type} for ${address}`)
  if (! SUBSCRIPTION_TYPES.includes(type)) throw new Error(`${type} is not a supported subscription type. Valid options are ${SUBSCRIPTION_TYPES}`)

  return subscription[type](address, callback)
}
