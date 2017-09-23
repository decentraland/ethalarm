import React from 'react'

import SelectContract from './steps/selectContract'
import LookingUp from './steps/lookingUp'
import InsertABI from './steps/insertABI'
import SelectEvents from './steps/selectEvents'

export default class App extends React.Component {
  render() {
    return (<div className='app-container'>
      <SelectEvents />
    </div>)
  }
}
