import { Log } from 'decentraland-commons'

const min = (array, prop) => array.reduce((prev, elem) => Math.min(prev, elem[prop]), Infinity)
const max = (array, prop) => array.reduce((prev, elem) => Math.max(prev, elem[prop]), -Infinity)
const nameMatches = (events, eventNames) => {
  eventNames = eventNames.map(name => name.replace(/\([^)]+\)/, ''))
  return events.reduce((prev, event) => prev || eventNames.includes(event.event), false)
}

export default class ScannerService {
  constructor(alarmService, ethService) {
    this.ethService = ethService
    this.alarmService = alarmService
    this.log = new Log('Scanner')
  }

  async run() {
    try {
      return this.ethService.watchNewBlocks(this.checkAlarms.bind(this))
    } catch (err) {
      this.log.error('Unable to start watching', err.stack)
    }
  }

  async checkAlarms() {
    const alarmService = this.alarmService
    const ethService = this.ethService
    try {
      const addressToAlarms = await alarmService.mapAddressesToAlarm()
      const allAddresses = Object.keys(addressToAlarms)
      const contracts = ethService.getContracts(await alarmService.getContractData(addressToAlarms))
      this.log.info(`Contracts found: ${contracts.length}`)
      const reorgSafety = await alarmService.getReorgSafety()
      const currentTip = await ethService.getCurrentTip()
      const lastBlockSync = await alarmService.mapAddressesToLastSync(allAddresses, currentTip)

      const height = await this.ethService.getCurrentTip()
      this.log.info(`Received new block height: ${height}`)

      await Promise.all(contracts.map(async (contract) => {
        const alarms = addressToAlarms[contract.address]
        this.log.info(`alarms: ${alarms}`)
        const fromBlock = lastBlockSync[contract.address] - max(alarms, 'blockConfirmations') - reorgSafety
        this.log.info(`fromBlock: ${fromBlock}`)
        const toBlock = height - min(alarms, 'blockConfirmations')
        this.log.info(`toBlock: ${toBlock}`)
        const events = await contract.getPastEvents('allEvents', { fromBlock, toBlock })
        this.log.info(`Data received for contract in ${contract.address}`, fromBlock, toBlock, events.length)
        const byTransaction = alarmService.mapByTransactionId(events)
        this.log.info(`byTransaction: ${byTransaction}`)
        for (let events of byTransaction) {
          const confirmations = height - events[0].blockNumber
          this.log.info(`confirmations: ${confirmations}`)
          await Promise.all(alarms.map(async (alarm) => {
            const existingReceipts = await alarmService.getReceipt(alarm.id, events[0].transactionHash)
            this.log.info(`existingReceipts: ${existingReceipts}`)
            if (confirmations >= alarm.blockConfirmations
              && nameMatches(events, alarm.eventNames)
              && !existingReceipts.length
            ) {
              this.log.info(`DISPATCH !!!`)
              await alarmService.dispatchNotification(alarm, events)
            }
          }))
        }
        await alarmService.storeLastSyncBlock(contract.address, height)
      })).catch(err => {
        this.log.error(`Error: ${err.stack}`)
      })
    } catch (err) {
      this.log.error(`Error: ${err.stack}`)
    }
  }
}
