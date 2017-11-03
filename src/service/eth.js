export class Eth {
  //constructor(config) {
  constructor() {}

  async initialize() {
    // Setup ethereum client
  }

  async getEvents(data) {
    const newFilter = await this.client.newFilter(data)
    return await new Promise((resolve, reject) => {
      newFilter.get((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
}
