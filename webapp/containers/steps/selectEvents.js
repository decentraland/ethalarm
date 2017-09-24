import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'

import NextButton from '~/components/nextButton'
import EventSelector from '~/components/eventSelector'
import SelectedContract from '~/components/selectedContract'
import SagaStep from './sagaStep'

class SelectEvents extends SagaStep{
  constructor(props) {
    super(...arguments)
    this.getEvents(props)
  }
  componentWillReceiveProps(newProps) {
    this.getEvents(newProps)
  }
  getIdForMethod(method) {
    // TODO: Return actually hash
    return this.getNameForMethod(method)
  }
  getNameForMethod(method) {
    const methodArgs = method.inputs.reduce(
      (cum, current) => (cum ? cum + ', ' : '') + `${current.name}:${current.type}`,
    '')
    return `${method.name}(${methodArgs})`
  }
  getEvents(props) {
    console.log(props)
    this.events = props.abi.filter(abi => abi.type === 'event').map(
      method => ({
        id: this.getIdForMethod(method),
        name: this.getNameForMethod(method)
      })
    )
  }
  render() {
    return (<div className='selectevents step'>
      <SelectedContract address={this.props.address} abi={this.props.abi} />
      <p>Select which events to subscribe to:</p>
      <EventSelector options={this.events} />
      <NextButton />
    </div>)
  }
}

const pick = fields => state => {
  console.log(state)
  const result = {}
  for (let field of fields) {
    result[field] = state[field]
  }
  return result
}

export default connect(pick(['address', 'abi']))(SelectEvents)
