import React from 'react'
import { connect } from 'react-redux'

import types from '~/types'

import SagaStep from './sagaStep'

class DeleteAlarm extends SagaStep {
  componentWillMount() {
    this.action()
  }

  createAction() {
    return {
      type: types.deleteAlarm,
      alarmId: this.getAlarmId()
    }
  }

  getAlarmId() {
    return this.props.match.params.alarmId
  }

  render() {
    return (
      <div className="success step">
        <p className="highlight">
          Success! <br/>You will no longer receive email notifications regarding this alarm.
        </p>
        <a href="/" className="next">[Home]</a>
      </div>
    )
  }
}

export default connect(() => ({}))(DeleteAlarm)

