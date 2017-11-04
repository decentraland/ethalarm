import React from 'react'
import PropTypes from 'prop-types'

export default class NextButton extends React.Component {
  static propTypes = {
    action: PropTypes.func,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    action: () => {}
  }

  render() {
    return (
      <button className="next" disabled={this.props.disabled} onClick={ event => !this.props.disabled && this.props.action(event) }>
        <span>next</span>
      </button>
    )
  }
}
