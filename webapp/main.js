import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware as RouterMiddleware } from 'react-router-redux'
import RedBox from 'redbox-react'

import './style/main.scss'
import routes from './routes'
import reducers from './reducers'

const history = createHistory()
const routerMiddleware = RouterMiddleware(history)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  composeEnhancers(
    applyMiddleware(routerMiddleware)
  )
)

const getRoot = () => document.getElementById('app')

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    getRoot()
  )
}

render(routes)

if (module.hot) {
  module.hot.accept('./routes', () => {
    try {
      render(routes)
    } catch (e) {
      ReactDOM.render(<RedBox error={e} />, getRoot())
    }
  })
}
