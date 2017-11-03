import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'

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
    return (
      <div className="verify step">
        <div className="explain">
          Please verify the configuration for the notification:
        </div>
        <LogDetail
          contractName="SomeContract"
          address="0x0F5D2fB29fb7d3CFeE444a200298f468908cC942"
          events={['Deposit', 'Withdraw']}
          email="john@doe.com"
        />
        <NextButton action={this.action} />
      </div>
    )
  }
}

export default connect(() => ({}))(Verify)
