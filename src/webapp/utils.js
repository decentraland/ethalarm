export function pick(fields) {
  return state => {
    const result = {}
    for (let field of fields) {
      result[field] = state[field]
    }
    return result
  }
}

export function preventDefault(callback) {
  return event => {
    event.preventDefault()
    callback(event)
  }
}
