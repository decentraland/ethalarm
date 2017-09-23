import React from 'react'

import SelectContract from './steps/selectContract'
import LookingUp from './steps/lookingUp'
import InsertABI from './steps/insertABI'
import SelectEvents from './steps/selectEvents'
import HowNotify from './steps/howNotify'

export default class App extends React.Component {
  render() {
    return (<div className='app-container'>
      <HowNotify />
    </div>)
  }
}
