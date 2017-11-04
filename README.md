# ethalarm

Get notified of events triggered by Ethereum contracts.

## Running

Run the server using:
```
npm install
npm start
```

Now, go to http://localhost:3000 and the frontend should be displayed to you.

## TODO

* [ ] Add some security to `fetch`
* [ ] Optimize scanner so it doesn't read the whole database each time
* [ ] Add tests

## API

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

```
{
  "id": "https://github.com/decentraland/ethalarm#POST-Response",
  "$schema": "http://json-schema.org/draft-06/schema#",
  "description": "Schema for a POST response of /alarm",
  "type": "object",
  "properties": {
    "ok": {
      "description": "Whether the request was successfull or not",
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

