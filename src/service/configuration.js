export class ConfigurationService {
  constructor() {
  }

  getServerInterface() {
  }

  getAlarmService() {
  }

  getEmailService() {
  }

  getTemplateService() {
  }

  getModels() {
    const alarmModel = this.alarmModel
    const alarmSyncStateModel = this.alarmSyncStateModel
    const alarmReceiptModel = this.alarmReceiptModel
    return { alarmModel, alarmSyncStateModel, alarmReceiptModel }
  }

  get alarmModel() {
    if (!this._alarmModel) {
      this.setupModels()
    }
    return this._alarmModel
  }

  get alarmSyncStateModel() {
    if (!this._alarmSyncStateModel) {
      this.setupModels()
    }
    return this._alarmSyncStateModel
  }

  get alarmReceiptModel() {
    if (!this._alarmReceiptModel) {
      this.setupModels()
    }
    return this._alarmReceiptModel
  }

  setupModels() {
    this._alarmModel = new AlarmModel(sequelize, DataTypes)
    this._alarmReceiptModel = new AlarmReceiptModel(sequelize, DataTypes);
    this._alarmSyncStateModel = new AlarmSyncStateModel(sequelize, DataTypes);
    this._alarmModel.associate({
      AlarmSyncState: this._alarmSyncStateModel,
      AlarmReceipt: this._alarmReceiptModel
    });
    this._alarmSyncStateModel.associate({ Alarm: this._alarmModel });
    this._alarmReceiptModel.associate({ Alarm: this._alarmModel });
  }
}
