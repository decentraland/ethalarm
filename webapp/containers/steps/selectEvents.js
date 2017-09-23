import React from 'react'

import NextButton from '~/components/nextButton'
import EventSelector from '~/components/eventSelector'
import SelectedContract from '~/components/selectedContract'

export default class SelectEvents extends React.Component {
  render() {
    return (<div className='selectevents step'>
      <SelectedContract address={''} abi={''} />
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
