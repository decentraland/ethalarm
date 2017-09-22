
export function getEnv(name, default) {
  if (!process.env[name]) {
    console.log(`Warning: No ${name} environment variable set, defaulting to ${default}`)
    return default
  }
  return process.env[name]
}

export function getWeb3WebSocketProvider() {
  return getEnv('WEB3_WS_PROVIDER', 'ws://localhost:8545')
}

export function isProduction() {
  return getName() === 'production'
}

export function isDevelopment() {
  return getName() === 'development'
}


export function getName() {
  return process.env.NODE_ENV
}
