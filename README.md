# ethalarm

Get notified of events triggered by Ethereum contracts.

## Running

Run the server using:
```
npm run docker:build
npm run docker
```

Now, go to http://localhost:3000 and the frontend should be displayed to you.

## Architecture

## TODO

[ ] Templates - write them up
[ ] Make Services injected with DI
[x] Create a configuration service to bootstrap configuration and models
[ ] Docker-compose: add server, postgres
[ ] Redo the frontend
[x] Implement all missing API endpoints
[ ] Verify Service implementation

## API

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

```
{
  "id": "https://github.com/decentraland/ethalarm#POST-Response",
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
abi: string
event_names: string (comma separated)
email: string
url: string
confirmation_code: string
block_confirmations: number
enabled: boolean
created_at: datetime
updated_at: datetime
deleted_at: datetime

AlarmSyncState
--------------
id: number
Alarm_id: string (FK to Alarm)
last_sync_block: number

AlarmReceipt
-------------
id: number
Alarm_id: string (FK to Alarm)
tx_hash: string
smtp_response: blob
http_response: blob
created_at: datetime
updated_at: datetime
```

## Checking for events

* Select unique addresses and ABIs
* Select last block sync' (if nothing stored, use current web3 block)
* pick reorgsafety: number of blocks where a reorg might happen
* For each new block:
  - for each unique address:
    - Call the `contract.events()` interface from web3 with `{fromBlock: lastSyncBlock-max(alarms.blockConfirmations)-reorgSafety, toBlock: currentTip-min(alarms.blockConfirmations)}`
    - for each event:
      - for each alarm: 
        * if tx height confirmed is greater or equal than alarm confirmations,
              event name matches alarm name,
              and no alarmreceipt for the tx of that event exists:
          - dispatch run notifications
    - set last sync block to current tip height


### Proposed implementation
```
class AlarmService {
  mapAddressesToAlarm() {}
  getContracts(addresses) {}
  getReorgSafety() {}
  mapAddressesToLastSync(defaultLastSync, addresses) {}
  getReceipt(alarmId, txHash) {}
  dispatchNotifications(alarm, event) {}
  storeLastSyncBlock(address, height) {}
}
class EthService {
  getCurrentTip() {}
  watchNewBlocks(blockHandler) {}
}
async function watch() {
  const addressToAlarms = await alarmService.mapAddressesToAlarm()
  const allAddresses = Object.keys(addressToAlarms)
  const contracts = await alarmService.getContracts(allAddresses)
  const reorgSafety = await alarmService.getReorgSafety()
  const currentTip = await ethService.getCurrentTip()
  const lastBlockSync = await alarmService.mapAddressesToLastSync(currentTip, allAddresses)

  return ethService.watchNewBlocks((block) => {
    const height = block.height
    await Promise.all(contracts.map(async (contract) => {
      const alarms = addressToAlarms[contract.address]
      const fromBlock = lastBlockSync[contract.address] - max(alarms.blockConfirmations) - reogSafety
      const toBlock = block.height - min(alarms.blockConfirmations)
      const events = await contract.getPastEvents('allEvents', { fromBlock, toBlock })
      for (let event in events) {
        const confirmations = height - event.blockHeight
        await Promise.all(alarms.map(async (alarm) => {
          if (confirmations >= alarm.blockConfirmations
              && event.event in alarm.eventNames
              && !(await alarmService.getReceipt(alarm.id, event.transactionHash))
          ) {
            await alarmService.dispatchNotification(alarm, event)
          }
        }))
      }
      await alarmService.storeLastBlockSync(contract.address, block)
    })
  })
}
```
