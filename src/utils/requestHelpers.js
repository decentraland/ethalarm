
export function handleRequest(callback) {
  return async (req, res) => {
    console.log('Handling request to', req.path)

    try {
      let data = await callback(req, res)
      data = data || {}

      return res.json(sendOk(data))

    } catch(error) {
      console.log('Error handling request', req.path, error)

      const data = error.data || {}
      const message = error.message

      return res.json(sendError(data, message))
    }
  }
}

export function extractFromReq(req, prop) {
  if (! req.query[prop] && ! req.body[prop]) throw new Error(`Could not get ${prop} from request`)

  let value = null

  if (req.query[prop]) {
    value = req.query[prop]
  } else if (req.body[prop]) {
    value = req.body[prop]
  }

  if (req.headers['content-type'] === 'application/json') {
    value = JSON.parse(value)
  }

  return value
}


function sendOk(data) {
  return { ok: true, data }
}

function sendError(data, error) {
  return { ok: false, data, error }
}
