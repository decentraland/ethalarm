import { delay } from 'redux-saga'
import { race, call, takeEvery, select, put } from 'redux-saga/effects'
import { push, replace } from 'react-router-redux'

import locations from './locations'
import types from './types'

function* allSagas() {
  yield takeEvery(types.setAddress               , handleAddressEntered)
  yield takeEvery(types.setABI                   , handleABI)
  yield takeEvery(types.setEventNames            , handleEvents)
  yield takeEvery(types.setNotificationPreference, handleNotification)
  yield takeEvery(types.confirm                  , handleConfirm)
}

function* handleABI(action) {
  const path = yield select(state => state.router.location.pathname)
  if (path === locations.lookingUp) {
    yield put(replace(locations.selectEvents))
  } else {
    yield put(push(locations.selectEvents))
  }
}

function* handleNotification(action) {
  yield put(push(locations.verify))
}

function* handleConfirm(action) {
  const state = yield select()

  yield call(postAlarm, {
    address: state.address,
    abi: JSON.stringify(state.abi),
    eventNames: state.eventNames,
    webhook: state.notification.webhook || '',
    email: state.notification.email || '',
    blockConfirmations: 0
  })

  yield put(push(locations.success))
}

function* handleEvents(action) {
  yield put(push(locations.howNotify))
}

function* handleAddressEntered(action) {
  yield put(push(locations.lookingUp))

  const { abi } = yield race({
    abi: call(getABI, action.address),
    timeout: call(delay, 2000)
  })

  if (abi) {
    yield put({
      type: types.setABI,
      abi: abi
    })
  } else {
    console.log(`Couldn't find a valid abi for ${action.address}`)
    yield put(push(locations.insertABI))
  }
}

async function getABI(address) {
  // TODO: conditional by selected net
  const url = `http://api.etherscan.io/api?module=contract&action=getabi&address=${address}&format=raw`

  return await fetch(url)
    .then(parseJson)
    .then(response => {
      if (response.message === 'NOTOK') {
        return null
      }
      return response
    })
    .catch(() => null)
}

async function postAlarm(alarm) {
  return await fetch('/alarms', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(alarm)
    })
    .then(parseJson)
}

function parseJson(e) {
  return e.json()
}

export default allSagas
