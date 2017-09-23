import React from 'react'

import Navbar from './navbar'
import Logo from './logo'
import App from './app'

export default class Root extends React.Component {
  render() {
    return (<div className='root'>
      <Navbar />
      <Logo />
      <App />
    </div>)
  }
}
