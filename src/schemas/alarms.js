const AlarmSchema = {
    "id": "https://github.com/decentraland/eventlog#POST-Request",
    "$schema": "http://json-schema.org/draft-06/schema#",
    "description": "Schema for a POST request to /alarm",
    "type": "object",
    "required": [ "address", "abi", "events", "confirmations" ],
    "properties": {
        "address": {
            "description": "The contract's address",
            "type": "string"
        },
        "abi": {
            "description": "The contract's ABI",
            "type": "string"
        },
        "events": {
            "description": "List of event names to watch for",
            "type": "array",
            "items": { "type": "string" }
        },
        "hook": {
            "description": "The URL to query when a new event is generated",
            "type": "string"
        },
        "email": {
            "description": "Email to send a notification",
            "type": "string"
        },
        "confirmations": {
            "description": "Amount of confirmations to wait before notifying",
            "type": "number"
        }
    }
}

export { AlarmSchema }
