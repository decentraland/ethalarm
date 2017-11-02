import React from 'react'

function SelectedContract({ address, abi }) {
  return (<div className='explain selectedContract'>
    <p>Contract: <strong>SomeSmartContract</strong></p>
    <p>Address: <strong>0x0F5D2fB29fb7d3CFeE444a200298f468908cC942</strong></p>
  </div>)
}

export default SelectedContract
