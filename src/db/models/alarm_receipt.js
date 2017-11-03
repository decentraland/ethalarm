/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  const AlarmReceipt = sequelize.define(
    'AlarmReceipt',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      alarmId: {
        type: DataTypes.UUID,
        references: {
          model: 'Alarm',
          key: 'id'
        },
        allowNull: false
      },
      eventNames: {
        type: DataTypes.STRING(64), // Couldn't find the actual length restriction if any
        allowNull: false
      },
      txHash: {
        type: DataTypes.STRING(66),
        allowNull: false
      },
      smtpResponse: {
        type: DataTypes.BLOB('medium')
      },
      httpResponse: {
        type: DataTypes.BLOB('medium')
      }
    },
    {
      tableName: 'AlarmReceipt',
      paranoid: false,
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  )

  AlarmReceipt.associate = function(models) {
    AlarmReceipt.belongsTo(models.Alarm, { foreignKey: 'alarmId' })
  }

  return AlarmReceipt
}
