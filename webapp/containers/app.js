import React from 'react'

import SelectContract from './steps/selectContract'
import LookingUp from './steps/lookingUp'
import InsertABI from './steps/insertABI'

export default class App extends React.Component {
  render() {
    return (<div className='app-container'>
      <InsertABI />
    </div>)
  }
}
