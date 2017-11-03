import React from 'react'

import Logo from '~/components/logo'

import Navbar from './navbar'

export default class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <Navbar />
        <div className="content">
          <Logo />
          {this.props.children}
        </div>
      </div>
    )
  }
}
