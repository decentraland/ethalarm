export default class DispatchService {
  constructor(httpService, emailService, templateName, receiptModel) {
    this.httpService = httpService
    this.emailService = emailService
    this.templateName = templateName
    this.receiptModel = receiptModel
  }

  async dispatch(alarm, event) {
    let httpResponse, smtpResponse

    if (alarm.email && alarm.email.length) {
      smtpResponse = await this.emaiService.sendMail(alarm.email, this.templateName, { alarm, event })
    }

    if (alarm.url && alarm.url.length) {
      httpResponse = await this.httpService.sendRequest(alarm, event)
    }

    return await this.storeReceipt(alarm.id, event.txHash, event.eventName, {
      httpResponse, smtpResponse
    })
  }

  storeReceipt(alarmId, txHash, eventName, extras) {
    const receipt = {
      Alarm_id: alarmId,
      tx_hash: txHash,
      event_name: eventName,
      http_response: extras.httpResponse,
      smtp_response: extras.smtpResponse
    }

    return this.receiptModel.create(receipt)
  }
}
