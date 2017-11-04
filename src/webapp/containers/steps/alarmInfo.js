import React from 'react'
import { connect } from 'react-redux'

import LoadingDots from '~/components/loadingDots'
import LogDetail from '~/components/logDetail'
import types from '~/types'

import SagaStep from './sagaStep'

class AlarmInfo extends SagaStep {
  componentWillMount() {
    this.action()
  }

  createAction() {
    return {
      type: types.fetchAlarm,
      alarmId: this.getAlarmId()
    }
  }

  getAlarmId() {
    return this.props.match.params.alarmId
  }

  render() {
    return (
      <div className="success step">
        { this.renderInner() }
        <a href="/" className="next">[Home]</a>
      </div>
    )
  }

  renderInner() {
    if (this.props.alarm.loading || !this.props.alarm.data) {
      return this.renderLoading()
    }
    if (this.props.alarm.error) {
      return this.renderError()
    }
    const alarm = this.props.alarm.data
    return (
      [
        <p key='title' className="highlight">
          Information for alarm:
        </p>,
        <LogDetail key='log'
          address={alarm.address}
          eventNames={alarm.eventNames.split(';')}
          email={alarm.email}
          webhook={alarm.webhook}
          id={alarm.id}
        />
      ]
    )
  }

  renderLoading() {
    return [<p key='text' className="highlight">
      Looking up the alarm information...
      </p>,
      <LoadingDots key='dots' />
    ]
  }

  renderError() {
    return <p className="highlight">
      We could not find the information regarding { this.getAlarmId() }.
    </p>
  }
}

export default connect((state) => ({alarm: state.alarm}))(AlarmInfo)

