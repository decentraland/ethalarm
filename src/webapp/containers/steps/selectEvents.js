import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'
import { pick } from '~/utils'

import NextButton from '~/components/nextButton'
import EventSelector from '~/components/eventSelector'
import SelectedContract from '~/components/selectedContract'
import SagaStep from './sagaStep'

class SelectEvents extends SagaStep {
  constructor(props) {
    super(props)
    this.eventSelector = null

    this.setEventNames(props)
  }

  createAction() {
    return {
      type: types.setEventNames,
      eventNames: this.eventSelector.getSelections()
    }
  }

  componentWillReceiveProps(newProps) {
    this.setEventNames(newProps)
  }

  getNameForMethod(method) {
    const methodArgs = method.inputs.reduce(
      (cum, current) =>
        (cum ? cum + ', ' : '') + `${current.name}:${current.type}`,
      ''
    )
    return `${method.name}(${methodArgs})`
  }

  setEventNames(props) {
    this.eventNames = props.abi.filter(abi => abi.type === 'event').map(method =>
      this.getNameForMethod(method)
    )
  }

  render() {
    return (
      <div className="selectevents step">
        <SelectedContract address={this.props.address} />
        <p>Select which events to subscribe to</p>
        <EventSelector ref={ eventSelector => this.eventSelector = eventSelector } options={this.eventNames} />
        <NextButton action={this.action} />
      </div>
    )
  }
}

export default connect(pick(['address', 'abi']))(SelectEvents)
