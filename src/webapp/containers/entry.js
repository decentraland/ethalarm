import React from 'react'
import { connect } from 'react-redux'
import uuid from 'uuid'

import { pick } from '~/utils'

import LogDetail from '~/components/logDetail'

class Entry extends React.Component {
  render() {
    const { address, events, notification } = this.props
    const { email, webhook } = notification

    const id = uuid.v4()

    return (
      <div className="success step">
        <div className="explain">
          <LogDetail
            address={address}
            events={events}
            email={email}
            webhook={webhook}
            id={id}
          />
        </div>
      </div>
    )
  }
}

export default connect(pick(['address', 'events', 'notification']))(Entry)
