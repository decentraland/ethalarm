import Web3 from 'web3'

const min = (array, prop) => reduce((prev, elem) => Math.min(prev, elem.prop), Infinity)
const max = (array, prop) => reduce((prev, elem) => Math.max(prev, elem.prop), -Infinity)

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

    return ethService.watchNewBlocks((block) => {
      const height = block.height
      await Promise.all(contracts.map(async (contract) => {
        const alarms = addressToAlarms[contract.address]
        const fromBlock = lastBlockSync[contract.address] - max(alarms, 'blockConfirmations') - reogSafety
        const toBlock = block.height - min(alarms, 'blockConfirmations')
        const events = await contract.getPastEvents('allEvents', { fromBlock, toBlock })
        this.log.debug(`Data received for contract in ${contract.address}`, alarms, fromBlock, toBlock, events)
        for (let event in events) {
          const confirmations = height - event.blockHeight
          await Promise.all(alarms.map(async (alarm) => {
            if (confirmations >= alarm.blockConfirmations
              && event.event in alarm.eventNames
              && !(await alarmService.getReceipt(alarm.id, event.transactionHash))
            ) {
              await alarmService.dispatchNotification(alarm, event)
            }
          }))
        }
        await alarmService.storeLastBlockSync(contract.address, block)
      }))
    })
  }
}
