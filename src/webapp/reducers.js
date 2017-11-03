import types from '~/types'

const INITIAL_STATE = {
  address: null,
  abi: null,
  events: null,
  id: null,
  notification: null
}

export default {
  address: (state = INITIAL_STATE.address, action) => {
    switch (action.type) {
      case types.setAddress:
        return action.address
      default:
        return state
    }
  },

  abi: (state = INITIAL_STATE.abi, action) => {
    switch(action.type) {
      case types.setABI:
        return action.abi
      default:
        return state
    }
  },

  events: (state = INITIAL_STATE.events, action) => {
    switch(action.type) {
      case types.setEvents:
        return action.events
      default:
        return state
    }
  },

  id: (state = INITIAL_STATE.id, action) => {
    switch(action.type) {
      case types.setId:
        return action.id
      default:
        return state
    }
  },

  notification: (state = INITIAL_STATE.notification, action) => {
    switch(action.type) {
      case types.setNotificationPreference:
        return action.notification
      default:
        return state
    }
  }
}

