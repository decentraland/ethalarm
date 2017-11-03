import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'
import { pick } from '~/utils'

import SagaStep from './sagaStep'
import LogDetail from '~/components/logDetail'
import NextButton from '~/components/nextButton'

class Verify extends SagaStep {
  createAction() {
    return {
      type: types.confirm
    }
  }

  render() {
    const { address, events, notification } = this.props
    const { email, webhook } = notification

    return (
      <div className="verify step">
        <div className="highlight">
          Please verify the configuration for the notification
        </div>

        <LogDetail
          contractName={address}
          address={address}
          events={events}
          email={email}
          webhook={webhook}
        />

        <NextButton action={this.action} />
      </div>
    )
  }
}

export default connect(pick(['address', 'events', 'notification']))(Verify)
