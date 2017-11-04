export default class ConfirmationService {
  constructor(emailService, templateName) {
    this.emailService = emailService
    this.templateName = templateName
  }

  sendConfirmationEmail(alarm) {
    return this.emailService.sendMail(alarm.email, this.templateName, alarm.dataValues)
  }

  setupTemplate() {
    const template = alarm => {
      return `Hello, ${alarm.email}

We received a request to notify you of the following events regarding the contract ${alarm.address}:
-${alarm.eventNames.split(';').join('\n  -')}

In order to confirm your email, please click on this link to start receiving notifications:

https://ethalarm.com/confirm/${alarm.confirmationCode}

Thanks,
The Decentraland Team`
    }
    const templateHTML = (alarm) => {
      return `Hello, ${alarm.email}<br/><br/>
      We received a request to notify you of the following events regarding the contract ${alarm.address}:
      <br/><br/><ul><li>${alarm.eventNames.split(';').join('</li><li>')}</ul><br/>
      <p> In order to confirm your email, please click on this link to start receiving notifications:<p>
      <div style="margin-left: 20px;"><a href=${url}>${url}</a></div>
      <p>Thanks,<br/>The Decentraland Team</p>`
    }
    this.emailService.setTemplate('confirmation', (opts) => ({
      from: `"The Decentraland Team" <noreply@decentraland.org>`,
      to: opts.alarm.email,
      subject: `[EthAlarm] Please verify your subscription to ${opts.alarm.address}`,
      text: template(alarm),
      html: templateHTML(alarm)
    }))
  }
}
