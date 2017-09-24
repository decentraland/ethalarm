import actions from './types'

function filterAction(name, handler) {
  return (store, action) => {
    if (action.type === name) {
      return handler(store, action)
    }
    return store
  }
}

function pick(field) {
  return (store, action) => action[field]
}

export default function() {
  return {
    address: filterAction(actions.setAddress, pick('address')),
    abi: filterAction(actions.setABI, pick('abi')),
    events: filterAction(actions.setEvents, pick('events')),
    notification: filterAction(actions.setNotificationPreference, pick('notification')),
    id: filterAction(actions.setId, pick('id'))
  }
}
