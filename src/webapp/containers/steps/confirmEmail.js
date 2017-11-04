import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'

import SagaStep from './sagaStep'

class ConfirmEmail extends SagaStep {
  componentWillMount() {
    this.action()
  }

  createAction() {
    return {
      type: types.confirmAlarm,
      confirmationCode: this.getConfirmationCode()
    }
  }

  getConfirmationCode() {
    return this.props.match.params.confirmationCode
  }

  render() {
    return (
      <div className="success step">
        <p className="highlight">
          Success! You will receive the email notifications you requested.
        </p>
        <a href="/" className="next">[Home]</a>
      </div>
    )
  }
}

export default connect(() => ({}))(ConfirmEmail)

