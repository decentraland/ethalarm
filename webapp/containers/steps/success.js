import React from 'react'

import LogDetail from '~/components/logDetail'
import NextButton from '~/components/nextButton'

export default class Success extends React.Component {
  render() {
    return (<div className='success step'>
      <p className='highlight'>Success! You'll be notified of new events for <strong>SomeSmartContract</strong></p>
      <div className='explain'>
        <p className='details'>Details for the entry</p>
        <LogDetail
          contractName='SomeContract'
          address='0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'
          events={['Deposit', 'Withdraw']}
          email='john@doe.com'
          id='ebf595a7-451e-483b-941a-ce87c510c437'
        />
      </div>
      <NextButton />
    </div>)
  }
}
