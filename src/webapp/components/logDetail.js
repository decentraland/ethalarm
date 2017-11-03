import React from 'react'
import PropTypes from 'prop-types'

class LogDetail extends React.Component {
  render() {
    const { address, eventNames, email, webhook, id } = this.props
    const url = `https://ethalarm.com/entry/${id}`

    return (
      <div className="logdetail">
        <p>
          Address
          <strong className="offset-value">{address}</strong>
        </p>

        <p>Events</p>
        <ul className="offset-value">
          {eventNames.map((eventName, index) => <EventItem key={ index } eventName={ eventName } />)}
        </ul>

        {email && (
          <p>
            Email notifications
            <strong className="offset-value">{email}</strong>
          </p>
        )}

        {webhook && (
          <p>
            Webhook
            <strong className="offset-value">{webhook}</strong>
          </p>
        )}

        {id && (
          <p>
            Permalink:&nbsp;
            <strong className="offset-value">
              <a href={url} target="_blank">
                {url}
              </a>
              &nbsp;
            </strong>
          </p>
        )}
      </div>
    )
  }
}

function EventItem({ eventName }) {
  return <li>
    <strong>{eventName}</strong>
  </li>
}

LogDetail.propTypes = {
  address: PropTypes.string.isRequired,
  eventNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  email: PropTypes.string,
  webhook: PropTypes.string
}

export default LogDetail
