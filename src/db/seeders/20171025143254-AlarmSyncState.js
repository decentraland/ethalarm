

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'AlarmSyncState',
      [
        {
          id: 1,
          alarmId: '3411d22e-d454-4bf3-aab1-2e711c9879bb',
          lastSyncBlock: 4446530
        },
        {
          id: 2,
          alarmId: '3411d22e-d454-4bf3-aab1-2e711c9879bc',
          lastSyncBlock: 1233312
        },
        {
          id: 3,
          alarmId: '3411d22e-d454-4bf3-aab1-2e711c9879bd',
          lastSyncBlock: 0
        },
        {
          id: 4,
          alarmId: '3411d22e-d454-4bf3-aab1-2e711c9879be',
          lastSyncBlock: 33
        }
      ],
      {}
    )
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('AlarmSyncState', null, {})
  }
}
