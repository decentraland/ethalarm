
export function getWeb3WebSocketProvider() {
  return process.env.WEB3_WS_PROVIDER || 'ws://localhost:8545'
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
