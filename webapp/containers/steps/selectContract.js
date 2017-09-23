import React from 'react'

import NextButton from '~/components/nextButton'
import QueryWithLargeInput from '~/components/queryWithLargeInput'

export default class SelectContract extends React.Component {
  render() {
    return (<div className='select-address step'>
      <QueryWithLargeInput>
        To start, please enter the contract's address:
      </QueryWithLargeInput>
      <NextButton />
    </div>)
  }
}
