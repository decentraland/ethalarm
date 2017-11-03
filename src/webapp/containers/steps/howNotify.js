import React from 'react'
import { connect } from 'react-redux'

import actions from '~/types'
import { preventDefault } from '~/utils'

import SagaStep from './sagaStep'
import NextButton from '~/components/nextButton'
import QueryWithLargeInput from '~/components/queryWithLargeInput'

class HowNotify extends SagaStep {
  componentWillMount() {
    this.email = null
    this.webhook = null
  }

  setEmail = (email) => {
    this.email = email
  };

  setWebhook = (webhook) => {
    this.webhook = webhook
  };

  createAction() {
    if (this.email.trim() || this.webhook.trim()) {
      return {
        type: actions.setNotificationPreference,
        notification: {
          email: this.email,
          hook: this.webhook
        }
      }
    }
  }

  render() {
    return (
      <div className="hownotify step">
        <p className="how">How would you like to be notified of new events?</p>

        <form action="/" method="GET" onSubmit={preventDefault(this.action)}>
          <QueryWithLargeInput type="email" onChange={this.setEmail}>
            Via email:
          </QueryWithLargeInput>

          <QueryWithLargeInput onChange={this.setWebhook}>
            Via a POST request to:
          </QueryWithLargeInput>

          <div className="text-center">
            <NextButton />
          </div>
        </form>
      </div>
    )
  }
}

export default  connect(() => ({}))(HowNotify)
