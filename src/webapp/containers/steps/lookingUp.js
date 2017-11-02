import React from 'react'

import LoadingDots from '~/components/loadingDots'

export default class LookingUp extends React.Component {
  render() {
    return (<div className='lookingup step'>
      <div className='explain'>
        <p>Looking up ABI for</p>
        <p>0x0F5D2fB29fb7d3CFeE444a200298f468908cC942</p>
      </div>
      <LoadingDots />
    </div>)
  }
}
