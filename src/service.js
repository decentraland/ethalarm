const sequelize_opts = require('./../config/database.json')
const Sequelize = require('sequelize')

// import { Eth } from './service/eth.js'
// import { EventService } from './service/events.js'
import { AlarmService } from './service/alarms.js'
// import { HookService } from './service/hooks.js'
// import { ScannerService } from './service/scanner.js'
//
const etherdelta_address = '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819'
const etherdelta_abi =
	[{'constant':false,'inputs':[{'name':'tokenGet','type':'address'},{'name':'amountGet','type':'uint256'},{'name':'tokenGive','type':'address'},{'name':'amountGive','type':'uint256'},{'name':'expires','type':'uint256'},{'name':'nonce','type':'uint256'},{'name':'user','type':'address'},{'name':'v','type':'uint8'},{'name':'r','type':'bytes32'},{'name':'s','type':'bytes32'},{'name':'amount','type':'uint256'}],'name':'trade','outputs':[],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'tokenGet','type':'address'},{'name':'amountGet','type':'uint256'},{'name':'tokenGive','type':'address'},{'name':'amountGive','type':'uint256'},{'name':'expires','type':'uint256'},{'name':'nonce','type':'uint256'}],'name':'order','outputs':[],'payable':false,'type':'function'},{'constant':true,'inputs':[{'name':'','type':'address'},{'name':'','type':'bytes32'}],'name':'orderFills','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'tokenGet','type':'address'},{'name':'amountGet','type':'uint256'},{'name':'tokenGive','type':'address'},{'name':'amountGive','type':'uint256'},{'name':'expires','type':'uint256'},{'name':'nonce','type':'uint256'},{'name':'v','type':'uint8'},{'name':'r','type':'bytes32'},{'name':'s','type':'bytes32'}],'name':'cancelOrder','outputs':[],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'amount','type':'uint256'}],'name':'withdraw','outputs':[],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'token','type':'address'},{'name':'amount','type':'uint256'}],'name':'depositToken','outputs':[],'payable':false,'type':'function'},{'constant':true,'inputs':[{'name':'tokenGet','type':'address'},{'name':'amountGet','type':'uint256'},{'name':'tokenGive','type':'address'},{'name':'amountGive','type':'uint256'},{'name':'expires','type':'uint256'},{'name':'nonce','type':'uint256'},{'name':'user','type':'address'},{'name':'v','type':'uint8'},{'name':'r','type':'bytes32'},{'name':'s','type':'bytes32'}],'name':'amountFilled','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'constant':true,'inputs':[{'name':'','type':'address'},{'name':'','type':'address'}],'name':'tokens','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'feeMake_','type':'uint256'}],'name':'changeFeeMake','outputs':[],'payable':false,'type':'function'},{'constant':true,'inputs':[],'name':'feeMake','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'feeRebate_','type':'uint256'}],'name':'changeFeeRebate','outputs':[],'payable':false,'type':'function'},{'constant':true,'inputs':[],'name':'feeAccount','outputs':[{'name':'','type':'address'}],'payable':false,'type':'function'},{'constant':true,'inputs':[{'name':'tokenGet','type':'address'},{'name':'amountGet','type':'uint256'},{'name':'tokenGive','type':'address'},{'name':'amountGive','type':'uint256'},{'name':'expires','type':'uint256'},{'name':'nonce','type':'uint256'},{'name':'user','type':'address'},{'name':'v','type':'uint8'},{'name':'r','type':'bytes32'},{'name':'s','type':'bytes32'},{'name':'amount','type':'uint256'},{'name':'sender','type':'address'}],'name':'testTrade','outputs':[{'name':'','type':'bool'}],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'feeAccount_','type':'address'}],'name':'changeFeeAccount','outputs':[],'payable':false,'type':'function'},{'constant':true,'inputs':[],'name':'feeRebate','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'feeTake_','type':'uint256'}],'name':'changeFeeTake','outputs':[],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'admin_','type':'address'}],'name':'changeAdmin','outputs':[],'payable':false,'type':'function'},{'constant':false,'inputs':[{'name':'token','type':'address'},{'name':'amount','type':'uint256'}],'name':'withdrawToken','outputs':[],'payable':false,'type':'function'},{'constant':true,'inputs':[{'name':'','type':'address'},{'name':'','type':'bytes32'}],'name':'orders','outputs':[{'name':'','type':'bool'}],'payable':false,'type':'function'},{'constant':true,'inputs':[],'name':'feeTake','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'constant':false,'inputs':[],'name':'deposit','outputs':[],'payable':true,'type':'function'},{'constant':false,'inputs':[{'name':'accountLevelsAddr_','type':'address'}],'name':'changeAccountLevelsAddr','outputs':[],'payable':false,'type':'function'},{'constant':true,'inputs':[],'name':'accountLevelsAddr','outputs':[{'name':'','type':'address'}],'payable':false,'type':'function'},{'constant':true,'inputs':[{'name':'token','type':'address'},{'name':'user','type':'address'}],'name':'balanceOf','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'constant':true,'inputs':[],'name':'admin','outputs':[{'name':'','type':'address'}],'payable':false,'type':'function'},{'constant':true,'inputs':[{'name':'tokenGet','type':'address'},{'name':'amountGet','type':'uint256'},{'name':'tokenGive','type':'address'},{'name':'amountGive','type':'uint256'},{'name':'expires','type':'uint256'},{'name':'nonce','type':'uint256'},{'name':'user','type':'address'},{'name':'v','type':'uint8'},{'name':'r','type':'bytes32'},{'name':'s','type':'bytes32'}],'name':'availableVolume','outputs':[{'name':'','type':'uint256'}],'payable':false,'type':'function'},{'inputs':[{'name':'admin_','type':'address'},{'name':'feeAccount_','type':'address'},{'name':'accountLevelsAddr_','type':'address'},{'name':'feeMake_','type':'uint256'},{'name':'feeTake_','type':'uint256'},{'name':'feeRebate_','type':'uint256'}],'payable':false,'type':'constructor'},{'payable':false,'type':'fallback'},{'anonymous':false,'inputs':[{'indexed':false,'name':'tokenGet','type':'address'},{'indexed':false,'name':'amountGet','type':'uint256'},{'indexed':false,'name':'tokenGive','type':'address'},{'indexed':false,'name':'amountGive','type':'uint256'},{'indexed':false,'name':'expires','type':'uint256'},{'indexed':false,'name':'nonce','type':'uint256'},{'indexed':false,'name':'user','type':'address'}],'name':'Order','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'name':'tokenGet','type':'address'},{'indexed':false,'name':'amountGet','type':'uint256'},{'indexed':false,'name':'tokenGive','type':'address'},{'indexed':false,'name':'amountGive','type':'uint256'},{'indexed':false,'name':'expires','type':'uint256'},{'indexed':false,'name':'nonce','type':'uint256'},{'indexed':false,'name':'user','type':'address'},{'indexed':false,'name':'v','type':'uint8'},{'indexed':false,'name':'r','type':'bytes32'},{'indexed':false,'name':'s','type':'bytes32'}],'name':'Cancel','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'name':'tokenGet','type':'address'},{'indexed':false,'name':'amountGet','type':'uint256'},{'indexed':false,'name':'tokenGive','type':'address'},{'indexed':false,'name':'amountGive','type':'uint256'},{'indexed':false,'name':'get','type':'address'},{'indexed':false,'name':'give','type':'address'}],'name':'Trade','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'name':'token','type':'address'},{'indexed':false,'name':'user','type':'address'},{'indexed':false,'name':'amount','type':'uint256'},{'indexed':false,'name':'balance','type':'uint256'}],'name':'Deposit','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'name':'token','type':'address'},{'indexed':false,'name':'user','type':'address'},{'indexed':false,'name':'amount','type':'uint256'},{'indexed':false,'name':'balance','type':'uint256'}],'name':'Withdraw','type':'event'}]

const sequelize = new Sequelize('ethalarm', null, null, sequelize_opts.development)
sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.')
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err)
	})

// const eth = new Eth() // TODO
// const events = new EventService(sequelize, Sequelize, eth)
const alarms = new AlarmService(sequelize, Sequelize)
// const hooks = new HookService()
// const scanner = new ScannerService(eth, events, alarms, hooks)

// scanner.startScanner(1000)
// console.log('Scanner started')

function printResults(result, label) {
  console.log('\x1b[1m======%s======\x1b[0m\n\x1b[2m%s\x1b[0m', label, JSON.stringify(result))
}

// alarms.getAlarms()
//   .then(function(result) {
//     printResults(result, 'getAlarms');
//   })

// alarms.storeNewAlarm({
// 		address: etherdelta_address,
// 		abi: JSON.stringify(etherdelta_abi),
// 		event_names: 'Deposit,Trade',
// 		email: 'myself@danielkelly.me',
// 		url: 'https://danielkelly.me/contract_events.php',
// 		block_confirmations: 5,
// 	}).then(function(result) {
//     printResults(result, 'storeNewAlarm');
//   })

// alarms.mapAddressesToAlarm()
//   .then(function(result) {
//     printResults(result, 'mapAddressesToAlarm');
//   })

// alarms.mapAddressesToLastSync(['0x8d12A197cB00D4747a1fe03395095ce2A5CC6819'], 10)
//   .then(function(result) {
//     printResults(result, 'mapAddressesToLastSync');
//   })

// alarms.getReceipt('3411d22e-d454-4bf3-aab1-2e711c9879bc', '0x5c8c0ce953202c42a13ae1183e86ade8ca08440774fb6b2fc23909f16b5dfe0e')
//   .then(function(result) {
//     printResults(result, 'getReceipt');
//   })

// alarms.storeLastSyncBlock('0x8d12A197cB00D4747a1fe03395095ce2A5CC6820', 60)
//   .then(function(result) {
//     printResults(result, 'storeLastSyncBlock');
//   })

