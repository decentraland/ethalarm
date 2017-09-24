import React from 'react'

export default class LargeInput extends React.Component {
  value() {
    return this.refs.input.value
  }
  handleEnter = (ev) => {
    if (ev.key === 'Enter') {
      if (this.props.onSubmit) {
        this.props.onSubmit(this.value())
      }
    }
  }
  render() {
    return (<div className='large-input'>
      <input ref='input' onKeyUp={this.handleEnter} />
    </div>)
  }
}
