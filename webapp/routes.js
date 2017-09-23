import React from 'react'
import { Route } from 'react-router'

import Root           from './containers/root'
import SelectContract from './containers/steps/selectContract'
import LookingUp      from './containers/steps/lookingUp'
import InsertABI      from './containers/steps/insertABI'
import SelectEvents   from './containers/steps/selectEvents'
import HowNotify      from './containers/steps/howNotify'
import Verify         from './containers/steps/verify'
import Success        from './containers/steps/success'

export default function() {
  return <Root>
    <Route exact path="/" component={SelectContract} />
    <Route path="/lookup" component={LookingUp} />
    <Route path="/insertABI" component={InsertABI} />
    <Route path="/selectEvents" component={SelectEvents} />
    <Route path="/howNotify" component={HowNotify} />
    <Route path="/verify" component={Verify} />
    <Route path="/success" component={Success} />
  </Root>
}
