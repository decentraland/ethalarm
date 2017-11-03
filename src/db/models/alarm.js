/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
  const Alarm = sequelize.define(
    'Alarm',
    {
      id: {
        type: DataTypes.UUID,
        //allowNull: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      address: {
        type: DataTypes.STRING(42),
        allowNull: false
      },
      abi: {
        type: DataTypes.STRING(65534),
        allowNull: false
      },
      eventNames: {
        type: DataTypes.STRING(512),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(254)
      },
      webhook: {
        type: DataTypes.STRING(2000)
      },
      blockConfirmations: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: '1'
      },
      confirmationCode: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      enabled: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: 'Alarm',
      paranoid: true,
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt'
    }
  )

  Alarm.associate = function(models) {
    Alarm.hasOne(models.AlarmSyncState, { foreignKey: 'alarmId' })
    Alarm.hasMany(models.AlarmReceipt, { foreignKey: 'alarmId' })
  }

  return Alarm
}
