import ConfigurationService, { DEVELOPMENT } from './service/configuration'

const environment = process.env.NODE_ENV || DEVELOPMENT
const configurationService = new ConfigurationService(environment)

async function run() {
  await configurationService.startDatabase()
  await configurationService.startServer()
  // await configurationService.startWatching()
}

run().catch(console.log)
