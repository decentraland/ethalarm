import React from 'react'
import PropTypes from 'prop-types'

export default class NextButton extends React.Component {
  static propTypes = {
    action: PropTypes.func
  };

  static defaultProps = {
    action: () => {}
  }

  render() {
    return (
      <button className="next" onClick={ event => this.props.action(event) }>
        <span>next</span>
      </button>
    )
  }
}
