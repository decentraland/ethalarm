
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Alarm', {
      id: {
        type: Sequelize.UUID,
        //allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      address: {
        type: Sequelize.STRING(42),
        allowNull: false
      },
      abi: {
        type: Sequelize.STRING(65534),
        allowNull: false
      },
      eventNames: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(254)
      },
      url: {
        type: Sequelize.STRING(2000)
      },
      blockConfirmations: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: '1'
      },
      confirmationCode: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Alarm')
  }
}
