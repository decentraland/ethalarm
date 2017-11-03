import React from 'react'
import { connect } from 'react-redux'

import { pick } from '~/utils'

import LogDetail from '~/components/logDetail'

class Success extends React.Component {
  render() {
    const { address, eventNames, notification, id } = this.props
    const { email, webhook } = notification

    return (
      <div className="success step">
        <p className="highlight">
          Success! You&#39;ll be notified of new events&nbsp;
        </p>
        <div className="explain">
          <LogDetail
            address={address}
            eventNames={eventNames}
            email={email}
            webhook={webhook}
            id={id}
          />
        </div>
      </div>
    )
  }
}

export default connect(pick(['address', 'eventNames', 'notification', 'id']))(Success)
