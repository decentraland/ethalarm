
// Simple in-memory storage. To be replaced for proper storage
const contracts = [
  // {
  //   address: String,
  //   subscriptionType: oneOf("events")
  //   notificationMethod: oneOf("email", "webhook")
  // }
]

export default {
  save({ address, subscriptionType, notificationMethod }) {
    const row = { address, subscriptionType, notificationMethod }

    console.log('Storing', JSON.stringify(row), 'on Database')
    contracts.push({ address, subscriptionType, notificationMethod })
  }
}
