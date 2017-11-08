export default class DispatchService {
  constructor(httpService, emailService, templateName, receiptModel) {
    this.httpService = httpService
    this.emailService = emailService
    this.templateName = templateName
    this.receiptModel = receiptModel
  }

  async dispatch(alarm, events) {
    console.log('DispatchService --> dispatch', alarm, events)
    let httpResponse, smtpResponse

    if (alarm.email && alarm.email.length) {
      smtpResponse = await this.emailService.sendMail(alarm.email, this.templateName, { alarm, events })
    }

    if (alarm.webhook && alarm.webhook.length) {
      httpResponse = await this.httpService.sendRequest(alarm, events)
    }

    return await this.storeReceipt(alarm.id, events[0].transactionHash, {
      httpResponse, smtpResponse
    })
  }

  storeReceipt(alarmId, txHash, extras) {
    console.log('Storing', arguments)
    const receipt = {
      alarmId: alarmId,
      txHash: txHash,
      httpResponse: extras.httpResponse,
      smtpResponse: extras.smtpResponse
    }

    return this.receiptModel.create(receipt)
  }
}
