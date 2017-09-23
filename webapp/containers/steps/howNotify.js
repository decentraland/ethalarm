import React from 'react'

import NextButton from '~/components/nextButton'
import LargeInput from '~/components/largeInput'
import SelectedContract from '~/components/selectedContract'
import QueryWithLargeInput from '~/components/queryWithLargeInput'

export default class HowNotify extends React.Component {
  render() {
    return (<div className='hownotify step'>
      <SelectedContract address={''} abi={''} />
      <p className='how'>How would you like to be notified of new events?</p>
      <QueryWithLargeInput ref='email'>
        Via email:
      </QueryWithLargeInput>
      <QueryWithLargeInput ref='webhook'>
        Via a POST request to:
      </QueryWithLargeInput>
      <NextButton />
    </div>)
  }
}
