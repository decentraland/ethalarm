import React from 'react'
import { connect } from 'react-redux'

import actions from '../../types'

import SagaStep from './sagaStep'
import NextButton from '~/components/nextButton'
import LargeInput from '~/components/largeInput'
import SelectedContract from '~/components/selectedContract'
import QueryWithLargeInput from '~/components/queryWithLargeInput'

class HowNotify extends SagaStep {
  createAction() {
    return {
      type: actions.setNotificationPreference,
      notification: {
        email: this.refs.email.value(),
        hook: this.refs.webhook.value()
      }
    }
  }
  render() {
    return (<div className='hownotify step'>
      <SelectedContract address={''} abi={''} />
      <p className='how'>How would you like to be notified of new events?</p>
      <QueryWithLargeInput ref='email' onSubmit={this.action}>
        Via email:
      </QueryWithLargeInput>
      <QueryWithLargeInput ref='webhook' onSubmit={this.action}>
        Via a POST request to:
      </QueryWithLargeInput>
      <NextButton action={this.action} />
    </div>)
  }
}

export default connect(() => ({}))(HowNotify)
