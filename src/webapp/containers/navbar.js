import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'
import { pick } from '~/utils'

import image from '../images/logo.png'

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
        <div className="navbar-logo">
          <a href="https://ethalarm.com" target="_blank" rel="noopener noreferrer">
            <h1 className="hidden-xs">EthAlarm</h1>
            <a href="https://decentraland.org" target="_blank" rel="noopener noreferrer">
              <img src={image} alt="Decentraland logo" width="24" height="24" style={{ position: 'relative', top: '-10px'}}/>
            </a>
          </a>
        </div>
        <ul className="networks">
          <li>
            <a href="https://medium.com/p/233660030d30" target="_blank" rel="noopener noreferrer">
              About
            </a>
          </li>
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
