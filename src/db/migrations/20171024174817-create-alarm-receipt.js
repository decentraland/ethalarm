
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AlarmReceipt', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      alarmId: {
        type: Sequelize.UUIDV4,
        references: {
          model: 'Alarm',
          key: 'id'
        },
        allowNull: false
      },
      eventNames: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      txHash: {
        type: Sequelize.STRING(66),
        allowNull: false
      },
      smtpResponse: {
        type: Sequelize.BLOB('medium')
      },
      httpResponse: {
        type: Sequelize.BLOB('medium')
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('AlarmReceipt')
  }
}
