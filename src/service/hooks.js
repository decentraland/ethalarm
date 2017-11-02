export class HookService {
  constructor(sequelize, DataTypes) {}

  wasHookTriggered(alarm, alarmHook, alarmEvent) {
    // Check database for AlarmReceipt for hook and event
  }

  executeEmailHook(alarm, alarmEvent, alarmHook) {}

  executeWebHook(alarm, alarmEvent, alarmHook) {}

  confirmEmailHook(confirmationHash) {
    // set AlarmHook to enabled when matching confirmation hash
  }

  createEmailHook(alarm, email) {}

  createWebHook(alarm, url) {}
}
