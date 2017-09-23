import React from 'react'

import LogDetail from '~/components/logDetail'
import NextButton from '~/components/nextButton'

export default class Verify extends React.Component {
  render() {
    return (<div className='verify step'>
      <div className='explain'>
        Please verify the configuration for the notification:
      </div>
      <LogDetail
        contractName='SomeContract'
        address='0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'
        events={['Deposit', 'Withdraw']}
        email='john@doe.com'
      />
      <NextButton />
    </div>)
  }
}
