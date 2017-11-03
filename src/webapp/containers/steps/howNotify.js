import React from 'react'
import { connect } from 'react-redux'

import actions from '../../types'

import SagaStep from './sagaStep'
import NextButton from '~/components/nextButton'
import SelectedContract from '~/components/selectedContract'
import QueryWithLargeInput from '~/components/queryWithLargeInput'

class HowNotify extends SagaStep {
  componentWillMount() {
    this.emailInput = null
    this.webhookInput = null
  }

  createAction() {
    return {
      type: actions.setNotificationPreference,
      notification: {
        email: this.emailInput.value,
        hook: this.webhookInput.value
      }
    }
  }

  render() {
    return (
      <div className="hownotify step">
        <SelectedContract address={''} abi={''} />
        <p className="how">How would you like to be notified of new events?</p>
        <QueryWithLargeInput refs={ emailInput => this.emailInput = emailInput } onSubmit={this.action}>
          Via email:
        </QueryWithLargeInput>
        <QueryWithLargeInput refs={ webhookInput => this.webhookInput = webhookInput } onSubmit={this.action}>
          Via a POST request to:
        </QueryWithLargeInput>
        <NextButton action={this.action} />
      </div>
    )
  }
}

export default connect(() => ({}))(HowNotify)
