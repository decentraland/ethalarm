import React from 'react'

import LargeInput from './largeInput'
import NextButton from './nextButton'

export default class SelectContract extends React.Component {
  render() {
    return (<div className='select-address step'>
      <div className='explain'>
        To start, please enter the contract's address:
      </div>
      <LargeInput name='address' />
      <NextButton />
    </div>)
  }
}
