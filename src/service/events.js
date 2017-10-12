
function selectLargestConfirmation(maximum, alarm) {
  if (maximum < alarm.confirmations) {
    return alarm.confirmations
  }
  return maximum
}

class EventService {

  constructor(db, eth) {
  }

  getLastBlock() {
    return db.getAlarmSyncState()
  }

  async getAlarmEvents(alarm, fromBlock, toBlock) {
    const confirmations = alarm.confirmations
    return await this.eth.getEvents({
      fromBlock: fromBlock - confirmations,
      toBlock: toBlock - confirmations,
      address: alarm.address
    })
  }

  isAlarmTriggered(alarm, alarmEvent, currentBlockHeight) {
    if (alarmEvent.removed) {
      return false
    }
    const confirmations = currentBlockHeight - alarmEvent.blockHeight
    return confirmations > alarm.confirmations
  }

  storeAlarmReceipt() {
    // Store data in database
  }
}
