

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AlarmReceipt',
      [
        {
          id: 1,
          alarmId: '3411d22e-d454-4bf3-aab1-2e711c9879bc',
          txHash:
            '0x5c8c0ce953202c42a13ae1183e86ade8ca08440774fb6b2fc23909f16b5dfe0e',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          alarmId: '3411d22e-d454-4bf3-aab1-2e711c9879bd',
          txHash:
            '0x5c8c0ce953202c42a13ae1183e86ade8ca08440774fb6b2fc23909f16b5dfe0e',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('AlarmReceipt', null, {})
  }
}
