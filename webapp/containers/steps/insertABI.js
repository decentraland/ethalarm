import React from 'react'

import NextButton from '~/components/nextButton'

export default class InsertABI extends React.Component {
  render() {
    return (<div className='insertabi step'>
      <div className='explain'>
        <p>Insert the ABI for contract <strong>0x0F5D2fB29fb7d3CFeE444a200298f468908cC942</strong>:</p>
      </div>
      <textarea />
      <NextButton />
    </div>)
  }
}
