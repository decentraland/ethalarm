import ConfigurationService, { DEVELOPMENT } from './service/configuration'

const environment = process.env.NODE_ENV || DEVELOPMENT
const configurationService = new ConfigurationService(environment)

configurationService.startServer()
