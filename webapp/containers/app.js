import React from 'react'

import SelectContract from './selectContract'
import LookingUp from './lookingUp'

export default class App extends React.Component {
  render() {
    return (<div className='app-container'>
      <LookingUp />
    </div>)
  }
}
