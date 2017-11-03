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
      Alarm_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Alarm',
          key: 'id'
        },
        allowNull: false
      },
      event_name: {
        type: DataTypes.STRING(64), // Couldn't find the actual length restriction if any
        allowNull: false
      },
      tx_hash: {
        type: DataTypes.STRING(66),
        allowNull: false
      },
      smtp_response: {
        type: DataTypes.BLOB('medium')
      },
      http_response: {
        type: DataTypes.BLOB('medium')
      }
    },
    {
      tableName: 'AlarmReceipt',
      paranoid: false,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  AlarmReceipt.associate = function(models) {
    AlarmReceipt.belongsTo(models.Alarm, { foreignKey: 'Alarm_id' })
  }

  return AlarmReceipt
}
