import ConfigurationService, { DEVELOPMENT } from './service/ConfigurationService'

const environment = process.env.NODE_ENV || DEVELOPMENT
const configurationService = new ConfigurationService(environment)

configurationService.startServer()
