import React from 'react'

import NextButton from '~/components/nextButton'
import EventSelector from '~/components/eventSelector'

export default class SelectEvents extends React.Component {
  render() {
    return (<div className='selectevents step'>
      <div className='explain'>
        <p>Contract: <strong>SomeSmartContract</strong></p>
        <p>Address: <strong>0x0F5D2fB29fb7d3CFeE444a200298f468908cC942</strong></p>
      </div>
      <p>Select which events to subscribe to:</p>
      <EventSelector options={[{
        name: 'Deposit',
        id: 'fa12ed12'
      }, {
        name: 'Withdraw',
        id: 'deadbeaf'
      }]} />
      <NextButton />
    </div>)
  }
}
