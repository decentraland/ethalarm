const Web3 = require('web3')

import { Log } from 'decentraland-commons'

export default class EthereumService {
  constructor(web3Provider) {
    this.web3 = new Web3(web3Provider)
    this.log = new Log('Ethereum')
  }

  async initialize() {
    try {
      await this.getCurrentTip()
    } catch(error) {
      this.log.error('Could not connect to the Ethereum node', error)
      throw error
    }
  }

  watchNewBlocks(callback) {
    return this.web3.eth.subscribe('newBlockHeaders', callback)
  }

  getCurrentTip() {
    return this.web3.eth.getBlockNumber()
  }

  getContracts(contractData) {
    return contractData.map(data => new this.web3.eth.Contract(data.abi, data.address))
  }
}
