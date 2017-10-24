/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AlarmSyncState', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		Alarm_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Alarm',
				key: 'id'
			}
		},
		last_sync_block: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0',
		},
	}, {
		tableName: 'AlarmSyncState'
	});
};
