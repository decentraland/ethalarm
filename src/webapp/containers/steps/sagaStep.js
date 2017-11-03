import React from 'react'

export default class SagaStep extends React.Component {
  action = (...args) => {
    this.props.dispatch(this.createAction(...args))
  }
}
