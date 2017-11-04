import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'
import { pick } from '~/utils'

class Navbar extends React.Component {
  onSelect(network) {
    this.props.dispatch({
      type: types.setNetwork,
      network
    })
  }

  render() {
    const { network } = this.props

    return (
      <div className="navbar">
        <ul>
          <NetworkItem name="mainnet" selected={network} onSelect={this.onSelect.bind(this)} />
          <NetworkItem name="ropsten" selected={network} onSelect={this.onSelect.bind(this)} />
        </ul>
      </div>
    )
  }
}

function NetworkItem({ name, selected, onSelect }) {
  const className = name === selected ? 'selected' : ''
  return <li className={ className } onClick={ () => onSelect(name) }>{ name }</li>

}

export default connect(pick(['network']))(Navbar)
