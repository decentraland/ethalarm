/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('alarm_sync_state', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		alarm_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'alarm',
				key: 'id'
			}
		},
		last_sync_block: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0',
		},
	}, {
		tableName: 'alarm_sync_state'
	});
};
