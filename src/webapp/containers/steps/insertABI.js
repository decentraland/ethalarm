import React from 'react'
import { connect } from 'react-redux'

import actions from '~/types'
import { pick } from '~/utils'

import SagaStep from './sagaStep'
import NextButton from '~/components/nextButton'

class InsertABI extends SagaStep {
  componentWillMount() {
    this.abiInput = null
  }

  createAction() {
    return {
      type: actions.setABI,
      abi: JSON.parse(this.abiInput.value)
    }
  }

  render() {
    const defaultData =
      '[{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"}],"name":"LandClaimContractSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"}],"name":"LandClaimExecuted","type":"event"}]'

    return (
      <div className="insertabi step">
        <div className="explain">
          <p>
            Insert the ABI for contract&nbsp;
            <strong>{this.props.address}</strong>
          </p>
        </div>
        <textarea ref={ abiInput => this.abiInput = abiInput } placeholder={defaultData} />
        <NextButton action={this.action} />
      </div>
    )
  }
}

export default connect(pick(['address']))(InsertABI)
