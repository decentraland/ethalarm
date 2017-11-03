import Web3 from 'web3'

export default class ScannerService {
  constructor(eth_provider, events, alarms) {
    this.web3 = new Web3(Web3.givenProvider || eth_provider)
    if (this.web3.isConnected()) {
      // show some dialog to ask the user to start a node
      console.log('Connected to RPC!')
    } else {
      // start web3 filters, calls, etc
      console.error('Could not connect to RPC...')
      return
    }

    // Parameters are other services
    this.events = events
    this.alarms = alarms

    this.running = false
  }

  processHistoricalEvents() {
    // Return hooks
  }

  async processNewHooks(triggered_hooks) {}

  async startScanner(timeout = 5000) {
    this.running = true
    this.run(timeout)
  }

  async run(timeout) {
    if (this.running) {
      await this.events.watchNewEvents(this.web3)

      // Do work
      // const triggered_hooks = this.processHistoricalEvents()
      // this.processHooks(triggered_hooks)

      let total_event_names = 0
      Object.keys(this.events.watching).forEach(address => {
        total_event_names += Object.keys(this.events.watching[address]).length
      })
      let total_events = 0
      Object.keys(this.events.events).forEach(address => {
        total_events += Object.keys(this.events.events[address]).length
      })
      // Schedule next run
      console.log(
        '%s: Currently watching %s event_names in %s contracts',
        new Date().toISOString(),
        total_event_names,
        Object.keys(this.events.watching.length)
      )
      console.log(
        '%s: Currently %s events triggered waiting for confirmations',
        new Date().toISOString(),
        total_events
      )

      await this.events
        .getAlarmsToTrigger(this.web3.eth.blockNumber)
        .then(async triggers => {
          for (let x = 0; x < triggers.length; ++x)
            await this.alarms.dispatchNotifications(
              triggers[x].alarm,
              triggers[x].event
            )
        })

      setTimeout(() => {
        this.run(timeout)
      }, timeout)
    } else {
      // Kill all the watchers
    }
  }

  stopScanner() {
    // Stop all watchers
    this.running = false
  }
}
