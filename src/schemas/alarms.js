const AlarmSchema = {
  id: 'https://github.com/decentraland/eventlog#POST-Request',
  $schema: 'http://json-schema.org/draft-06/schema#',
  description: 'Schema for a POST request to /alarm',
  type: 'object',
  required: ['address', 'abi', 'eventNames', 'blockConfirmations'],
  properties: {
    address: {
      description: 'The contract\'s address',
      type: 'string'
    },
    abi: {
      description: 'The contract\'s ABI',
      type: 'string'
    },
    eventNames: {
      description: 'List of event names to watch for',
      type: 'string'
    },
    webhook: {
      description: 'The URL to query when a new event is generated',
      type: 'string'
    },
    email: {
      description: 'Email to send a notification',
      type: 'string'
    },
    blockConfirmations: {
      description: 'Amount of confirmations to wait before notifying',
      type: 'number'
    }
  }
}

export default AlarmSchema
