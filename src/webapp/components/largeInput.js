import React from 'react'

export default class LargeInput extends React.Component {
  componentWillMount() {
    this.input = null
  }

  value() {
    return this.input.value
  }

  handleEnter = ev => {
    if (ev.key === 'Enter') {
      if (this.props.onSubmit) {
        this.props.onSubmit(this.value())
      }
    }
  };

  render() {
    return (
      <div className="large-input">
        <input ref={ input => this.input = input } onKeyUp={this.handleEnter} />
      </div>
    )
  }
}
