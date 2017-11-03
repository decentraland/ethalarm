import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware as RouterMiddleware
} from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import reduxLogger from 'redux-logger'

import './style/main.scss'
import routes from './routes'
import reducers from './reducers'
import sagas from './sagas'

const history = createHistory()
const routerMiddleware = RouterMiddleware(history)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  {},
  composeEnhancers(applyMiddleware(routerMiddleware, reduxLogger, sagaMiddleware))
)

sagaMiddleware.run(sagas)
const getRoot = () => document.getElementById('app')

const render = Routes => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
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
    } catch (error) {
      console.error(error)
    }
  })
}
