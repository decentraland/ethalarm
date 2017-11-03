import React from 'react'
import { connect } from 'react-redux'

import actions from '../../types'

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
            Insert the ABI for contract{' '}
            <strong>0x0F5D2fB29fb7d3CFeE444a200298f468908cC942</strong>:
          </p>
        </div>
        <textarea ref={ abiInput => this.abiInput = abiInput } value={defaultData} />
        <NextButton action={this.action} />
      </div>
    )
  }
}

export default connect(() => ({}))(InsertABI)
