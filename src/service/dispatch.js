export default class DispatchService {
  constructor(httpService, emailService, templateName, receiptModel) {
    this.httpService = httpService
    this.emailService = emailService
    this.templateName = templateName
    this.receiptModel = receiptModel
  }

  async dispatch(alarm, events) {
    let httpResponse, smtpResponse

    if (alarm.email && alarm.email.length) {
      smtpResponse = await this.emaiService.sendMail(alarm.email, this.templateName, { alarm, events })
    }

    if (alarm.webhook && alarm.webhook.length) {
      httpResponse = await this.httpService.sendRequest(alarm, events)
    }

    return await this.storeReceipt(alarm.id, events[0].txHash, {
      httpResponse, smtpResponse
    })
  }

  storeReceipt(alarmId, txHash, extras) {
    const receipt = {
      alarmId: alarmId,
      txHash: txHash,
      httpResponse: extras.httpResponse,
      smtpResponse: extras.smtpResponse
    }

    return this.receiptModel.create(receipt)
  }
}
