import Web3 from 'web3'

import { Log } from 'decentraland-commons'

export class EthereumService {
  constructor(web3Provider) {
    this.web3 = new Web3(web3Provider)
    this.log = new Log('Ethereum')
  }

  async initialize() {
    try {
      await this.getCurrentTip()
    } catch(error) {
      this.log.error(`Could not connect to the Ethereum node`, error)
      throw error
    }
  }

  getCurrentTip() {
    return this.web3.eth.getBlockNumber()
  }

  getContracts(contractData) {
    return contractData.map(data => new this.web3.eth.Contract(data.address, data.abi))
  }
}
