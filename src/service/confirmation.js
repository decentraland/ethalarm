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
      const url = `https://ethalarm.colu.com/confirm/${alarm.confirmationCode}`
      return `Hello, ${alarm.email}

We received a request to notify you of the following events regarding the contract ${alarm.address}:
-${alarm.eventNames.split(';').join('\n  -')}

In order to confirm your email, please click on this link to start receiving notifications:

  ${url}

Thanks,
The Colu Team`
    }
    const templateHTML = (alarm) => {
      const url = `https://ethalarm.colu.com/confirm/${alarm.confirmationCode}`
      return `Hello, ${alarm.email}<br/><br/>
      We received a request to notify you of the following events regarding the contract ${alarm.address}:
      <br/><br/><ul><li>${alarm.eventNames.split(';').join('</li><li>')}</ul><br/>
      <p> In order to confirm your email, please click on this link to start receiving notifications:<p>
      <div style="margin-left: 20px;"><a href=${url}>${url}</a></div>
      <p>Thanks,<br/>The Colu Team</p>`
    }
    this.emailService.setTemplate('confirmation', (opts) => ({
      from: `"The Colu Team" <system@colu.com>`,
      to: opts.email,
      subject: `[EthAlarm] Please verify your subscription to ${opts.address}`,
      text: template(opts),
      html: templateHTML(opts)
    }))
  }
}
