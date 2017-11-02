import React from 'react'

import LargeInput from '~/components/largeInput'

export default class QueryWithLargeInput extends React.Component {
  value() {
    return this.refs.input.value()
  }
  onSubmit = (ev) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.value())
    }
  }
  render() {
    return (<div className={this.props.className + ' queryLarge'}>
      <div className='explain'>
        {this.props.children}
      </div>
      <LargeInput ref='input' onSubmit={this.onSubmit}/>
    </div>)
  }
}
