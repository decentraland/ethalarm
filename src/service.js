// const BigNumber = require('bignumber')
const Web3 = require('web3')
const WEB3_SERVER_URL = 'http://10.0.0.9:8545'
const WEB3_PROVIDER = new Web3.providers.HttpProvider(WEB3_SERVER_URL)

const sequelize_opts = require('./../config/database.json')
const Sequelize = require('sequelize')

//import { Eth } from './service/eth.js'
import { EventService } from './service/events.js'
import { AlarmService } from './service/alarms.js'
import { ScannerService } from './service/scanner.js'

sequelize_opts.development.logging = false
const sequelize = new Sequelize('ethalarm', null, null, sequelize_opts.development)

// const eth = new Eth() // TODO
const alarms = new AlarmService(sequelize, Sequelize)
const events = new EventService(sequelize, Sequelize, alarms)
const scanner = new ScannerService(WEB3_PROVIDER, events, alarms)

sequelize.authenticate()
	.then(() => {
			console.log('Connection has been established successfully.')
		})
	.then(() => {
			scanner.startScanner(1000)
			console.log('Scanner started')
		})
	.catch(err => {
			console.error('Unable to connect to the database:', err)
		})

// function printResults(result, label) {
// 	console.log('\x1b[1m======%s======\x1b[0m\n\x1b[2m%s\x1b[0m', label, JSON.stringify(result))
// }

// alarms.getAlarms()
//   .then(function(result) {
//     printResults(result, 'AlarmService.getAlarms');
//   })

// alarms.storeNewAlarm({
// 		address: etherdelta_address,
// 		abi: JSON.stringify(etherdelta_abi),
// 		event_names: 'Deposit,Trade',
// 		email: 'myself@danielkelly.me',
// 		url: 'https://danielkelly.me/contract_events.php',
// 		block_confirmations: 5,
// 	}).then(function(result) {
//     printResults(result, 'AlarmService.storeNewAlarm');
//   })

// alarms.mapAddressesToAlarm()
//   .then(function(result) {
//     printResults(result, 'AlarmService.mapAddressesToAlarm');
//   })

// alarms.mapAddressesToLastSync(['0x8d12A197cB00D4747a1fe03395095ce2A5CC6819'], 10)
//   .then(function(result) {
//     printResults(result, 'AlarmService.mapAddressesToLastSync');
//   })

// alarms.getReceipt('3411d22e-d454-4bf3-aab1-2e711c9879bc', '0x5c8c0ce953202c42a13ae1183e86ade8ca08440774fb6b2fc23909f16b5dfe0e', 'Trade')
//   .then(function(result) {
//     printResults(result, 'AlarmService.getReceipt');
//   })

// events.addSeen({
//     address: '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819',
//     blockHash: '0x33f7433568ac3bd67db63a8eac6b43bbaf88a4789878f4389590c9978e6c35d8',
//     blockNumber: 4451922,
//     logIndex: 0,
//     transactionHash: '0x1c1f5e52164f395332e1e68bafd89cfe0c76211d894f36fec502ba125c7f23c8',
//     transactionIndex: 0,
//     transactionLogIndex: '0x0',
//     type: 'mined',
//     event: 'Trade',
//     args: {
//       tokenGet: '0x0000000000000000000000000000000000000000',
//       amountGet: 0.0000103123,
//       tokenGive: '0x27dce1ec4d3f72c3e457cc50354f1f975ddef488',
//       amountGive: 0.0000103123,
//       get: '0x2dad638998a5433d8e6cfc16d5f129affb607265',
//       give: '0xd5f6f23b67831e2b81d37c2a15781403eae63a3f'
//     }
//   })
//   .then((results) => {
//       printResults(results, 'EventService.add')
//     })

// events.getLastSyncBlock()
//   .then((results) => {
//       printResults(results, 'EventService.getLastSyncBlock')
//     })

// events.storeLastSyncBlock('0x8d12A197cB00D4747a1fe03395095ce2A5CC6820', 62)
//   .then(function(result) {
//     printResults(result, 'EventService.storeLastSyncBlock');
//   })

// events.watchNewEvents()
	// .then((result) => {
	//     printResults(result, 'EventService.watchNewEvents');
	//   })
