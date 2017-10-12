# eventlog

A tool to get notified about new events triggered by smart contracts.

## Running

Run the server using:
```
npm install
npm start
```

Now, go to http://localhost:3000 and the frontend should be displayed to you.

## API

The API is currently not implemented. There's a mock method in https://github.com/decentraland/eventlog/blob/master/src/server.js#L39 but it's currently not being used.

There should be only three endpoints to the API:

### `POST /alarms`

Creates a new alarm, based on data posted through a JSON.
To activate email alerts, an email should be dispatched to the user with a unique hash that should be confirmed (see the `POST /emails/:email/confirmation` endpoint).

The request content should follow this [schema](http://json-schema.org/):

```
{
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
```

Example request body:
```
{
  "address": "0xcca95e580bbbd04851ebfb85f77fd46c9b91f11c",
  "events": ["LockedBalance"],
  "hook": "https://decentraland.org/",
  "confirmations": 6,
  "abi": "[{\"constant\":false,\"inputs\":[{\"name\":\"target\",\"type\":\"address\"}],\"name\":\"setTargetContract\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"totalLocked\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_acceptingDeposits\",\"type\":\"bool\"}],\"name\":\"changeContractState\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_from\",\"type\":\"address\"},{\"name\":\"mana\",\"type\":\"uint256\"}],\"name\":\"lockMana\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"manaToken\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"landClaim\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"lockedBalance\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"acceptingDeposits\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"inputs\":[{\"name\":\"_token\",\"type\":\"address\"}],\"payable\":false,\"type\":\"constructor\"},{\"payable\":true,\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"mana\",\"type\":\"uint256\"}],\"name\":\"LockedBalance\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"target\",\"type\":\"address\"}],\"name\":\"LandClaimContractSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"LandClaimExecuted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"_acceptingDeposits\",\"type\":\"bool\"}"
}
```

The response body for this method follows a simple schema:

```{
  "id": "https://github.com/decentraland/eventlog#POST-Response",
  "$schema": "http://json-schema.org/draft-06/schema#",
  "description": "Schema for a POST response of /alarm",
  "type": "object",
  "properties": {
    "ok": {
      "description": "Whether the request was successful or not",
      "type": "bool"
    },
    "error": {
      "description": "If there was an error, a human-readable error explaining it",
      "type": "string"
    },
    "result": {
      "type": "object",
      "properties": {
        "id": {
          "description": "An ID to identify the recently created alarm",
          "type": "string"
        }
      }
    }
  }
}
```

### `GET /alarms/:id`

This method should return the data stored in the database for this alarm. It could also return information about triggered alerts for those alarms.

### `DELETE /alarms/:id`

Stop watching the alarm referenced.

### `POST /confirmations/:hash`

Confirmation to start sending emails for the given hash.

## DB Schema

Proposed implementation for the database schema:

```
Alarm
-----
id: string (uuid v4)
address: string
events: string (comma separated)
email: string
confirmation_code: string
confirmations: number
enabled: boolean
createdAt: timestamp
updatedAt: timestamp
deleted: boolean

AlarmSyncState
--------------
id: number
alarmId: string (FK to Alarm)
lastBlockHeight: number
lastBlockHash: string

AlarmReceipt
-------------
id: number
alarmId: string (FK to Alarm)
hookId: number (FK to AlarmHook)
txHash: string
blockHash: string
response: blob
createdAt: timestamp

AlarmHook
----------
id: number
alarmId: string (FK to Alarm)
type: string ('http_post', 'http_get', 'email', ...)
config: string (URL if type = 'http', email address (or null for Alarm.email) if type = 'email')
data: string (template of the data to send to the hook. json with key=>value for http hooks, email template text/html. Both using some templating engine, ?http://mustache.github.io/?)
enabled: boolean
createdAt: timestamp
deleted: boolean
```
