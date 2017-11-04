import { Log } from 'decentraland-commons'

const min = (array, prop) => array.reduce((prev, elem) => Math.min(prev, elem.prop), Infinity)
const max = (array, prop) => array.reduce((prev, elem) => Math.max(prev, elem.prop), -Infinity)
const nameMatches = (events, eventNames) => events.reduce((prev, event) => prev || eventNames.includes(event.event), false)

export default class ScannerService {
  constructor(alarmService, ethService) {
    this.ethService = ethService
    this.alarmService = alarmService
    this.log = new Log('Scanner')
  }

  async run() {
    const alarmService = this.alarmService
    const ethService = this.ethService

    const addressToAlarms = await alarmService.mapAddressesToAlarm()
    const allAddresses = Object.keys(addressToAlarms)
    const contracts = ethService.getContracts(await alarmService.getContractData(addressToAlarms))
    const reorgSafety = await alarmService.getReorgSafety()
    const currentTip = await ethService.getCurrentTip()
    const lastBlockSync = await alarmService.mapAddressesToLastSync(currentTip, allAddresses)

    return ethService.watchNewBlocks(async (block) => {
      const height = block.height
      await Promise.all(contracts.map(async (contract) => {
        const alarms = addressToAlarms[contract.address]
        const fromBlock = lastBlockSync[contract.address] - max(alarms, 'blockConfirmations') - reorgSafety
        const toBlock = block.height - min(alarms, 'blockConfirmations')
        const events = await contract.getPastEvents('allEvents', { fromBlock, toBlock })
        this.log.debug(`Data received for contract in ${contract.address}`, alarms, fromBlock, toBlock, events)
        const byTransaction = alarmService.mapByTransactionId(events)
        for (let events in byTransaction) {
          const confirmations = height - events[0].blockHeight
          await Promise.all(alarms.map(async (alarm) => {
            if (confirmations >= alarm.blockConfirmations
              && nameMatches(events, alarm.eventNames)
              && !(await alarmService.getReceipt(alarm.id, events[0].transactionHash))
            ) {
              await alarmService.dispatchNotification(alarm, events)
            }
          }))
        }
        await alarmService.storeLastBlockSync(contract.address, block)
      }))
    })
  }
}
