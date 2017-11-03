import React from 'react'

export default class SagaStep extends React.Component {
  constructor(...args) {
    super(...args)
    this.action = () => this.props.dispatch(this.createAction())
  }
}
