import fetch from 'isomorphic-fetch'

export default class Http {
  sendRequest(alarm, event) {
    return fetch(alarm.webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(event)
    }).then(res => res.text())
  }
}
