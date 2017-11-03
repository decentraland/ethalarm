import React from 'react'
import PropTypes from 'prop-types'

export default class LargeInput extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {
    type: "text",
    required: false,
    onChange: () => {}
  };

  onChange = event => {
    this.props.onChange(event.currentTarget.value)
  };

  render() {
    const { type, required } = this.props

    return (
      <div className="large-input">
        <input type={type} required={required} onChange={this.onChange} />
      </div>
    )
  }
}
