import React from 'react'

import LargeInput from '~/components/largeInput'

export default class QueryWithLargeInput extends React.Component {
  render() {
    const { className = '', children, type, required, onChange } = this.props

    return (
      <div className={`${className} queryLarge`}>
        <div className="explain">{children}</div>
        <LargeInput type={type} required={required} onChange={onChange} />
      </div>
    )
  }
}
