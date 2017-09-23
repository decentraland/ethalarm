import React from 'react'

import LargeInput from '~/components/largeInput'
import NextButton from '~/components/nextButton'

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
