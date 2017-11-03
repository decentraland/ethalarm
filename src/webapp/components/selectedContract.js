import React from 'react'

function SelectedContract({ address }) {
  return (
    <div className="explain selectedContract">
      <p>
        Address
        <strong className="offset-value">{ address }</strong>
      </p>
    </div>
  )
}

export default SelectedContract
