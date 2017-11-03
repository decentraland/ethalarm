import React from 'react'

export default class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <ul>
          <li className="selected">mainnet</li>
          <li>ropsten</li>
          <li>about</li>
        </ul>
      </div>
    )
  }
}
