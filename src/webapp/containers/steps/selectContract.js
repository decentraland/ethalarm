import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'

import NextButton from '~/components/nextButton'
import QueryWithLargeInput from '~/components/queryWithLargeInput'
import SagaStep from './sagaStep'

class SelectContract extends SagaStep {
  componentWillMount() {
    this.addressInput = null
  }

  createAction() {
    return {
      type: types.setAddress,
      address: this.addressInput.value
    }
  }

  render() {
    return (
      <div className="select-address step">
        <QueryWithLargeInput ref={ addressInput => this.addressInput = addressInput } onSubmit={this.action}>
          To start, please enter the contract&#39;s address:
        </QueryWithLargeInput>
        <NextButton action={this.action} />
      </div>
    )
  }
}

export default connect(() => ({}))(SelectContract)
