import React from 'react'

import LargeInput from '~/components/largeInput'

export default class QueryWithLargeInput extends React.Component {
  componentWillMount() {
    this.input = null
  }

  value() {
    return this.input.value
  }

  onSubmit = ev => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.value())
    }
  };

  render() {
    return (
      <div className={this.props.className + ' queryLarge'}>
        <div className="explain">{this.props.children}</div>
        <LargeInput ref={ input => this.input = input } onSubmit={this.onSubmit} />
      </div>
    )
  }
}
