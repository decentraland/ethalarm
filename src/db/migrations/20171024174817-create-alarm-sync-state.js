
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AlarmSyncState', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      alarmId: {
        type: Sequelize.UUIDV4,
        allowNull: false,
        references: {
          model: 'Alarm',
          key: 'id'
        }
      },
      lastSyncBlock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '0'
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AlarmSyncState')
  }
}
