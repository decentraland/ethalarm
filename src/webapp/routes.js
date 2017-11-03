import React from 'react'
import { Route } from 'react-router'

import locations from './locations'

import Root from './containers/root'
import SelectContract from './containers/steps/selectContract'
import LookingUp from './containers/steps/lookingUp'
import InsertABI from './containers/steps/insertABI'
import SelectEvents from './containers/steps/selectEvents'
import HowNotify from './containers/steps/howNotify'
import Verify from './containers/steps/verify'
import Success from './containers/steps/success'

export default function routes() {
  return (
    <Root>
      <Route exact path={locations.root}   component={SelectContract} />
      <Route path={locations.lookingUp}    component={LookingUp} />
      <Route path={locations.insertABI}    component={InsertABI} />
      <Route path={locations.selectEvents} component={SelectEvents} />
      <Route path={locations.howNotify}    component={HowNotify} />
      <Route path={locations.verify}       component={Verify} />
      <Route path={locations.success}      component={Success} />
    </Root>
  )
}
