import React from 'react'
import PropTypes from 'prop-types'

class LogDetail extends React.Component {
  render() {
    const url = `https://ethalarm.com/entry/${this.props.id}`
    return (<div className='logdetail'>
      <p>Contract: <strong>{this.props.contractName}</strong></p>
      <p>Address: <strong>{this.props.address}</strong></p>
      <p>Events:</p>
      <ul>
        { this.props.events.map(event => <li key={event}>{event}</li>) }
      </ul>
      { this.props.email &&
        <p>Email notifications: <strong>{this.props.email}</strong></p>
      }
      { this.props.webhook &&
        <p>Webhook: <strong>{this.props.webhook}</strong></p>
      }
      { this.props.id &&
        <p>Permalink: <strong><a href={url} target="_blank">{ url}</a> </strong></p>
      }
    </div>)
  }
}

LogDetail.propTypes = {
  contractName: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.string).isRequired,
  email: PropTypes.string,
  webhook: PropTypes.string
}

export default LogDetail
