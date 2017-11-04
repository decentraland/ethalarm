import React from 'react'
import { Route, Switch } from 'react-router'

import locations from './locations'

import Root from './containers/root'
import SelectContract from './containers/steps/selectContract'
import LookingUp from './containers/steps/lookingUp'
import InsertABI from './containers/steps/insertABI'
import SelectEvents from './containers/steps/selectEvents'
import HowNotify from './containers/steps/howNotify'
import Verify from './containers/steps/verify'
import Success from './containers/steps/success'
import DeleteAlarm from './containers/steps/deleteAlarm'
import ConfirmEmail from './containers/steps/confirmEmail'
import AlarmInfo from './containers/steps/alarmInfo'

export default function Routes() {
  return (
    <Root>
      <Switch>
          <Route exact path={locations.root}          component={SelectContract} />
          <Route exact path={locations.lookingUp}     component={LookingUp} />
          <Route exact path={locations.insertABI}     component={InsertABI} />
          <Route exact path={locations.selectEvents}  component={SelectEvents} />
          <Route exact path={locations.howNotify}     component={HowNotify} />
          <Route exact path={locations.verify}        component={Verify} />
          <Route exact path={locations.success}       component={Success} />
          <Route exact path={locations.delete}        component={DeleteAlarm} />
          <Route exact path={locations.confirm}       component={ConfirmEmail} />
          <Route exact path={locations.info}          component={AlarmInfo} />

          <Route from="*" component={SelectContract} />
      </Switch>
    </Root>
  )
}
