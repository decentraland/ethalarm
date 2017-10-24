/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AlarmReceipt', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
		},
		Alarm_id: {
			type: DataTypes.UUID,
			references: {
				model: 'Alarm',
				key: 'id'
			},
			allowNull: false,
		},
		tx_hash: {
			type: DataTypes.STRING(66),
			allowNull: false
		},
		smtp_response: {
			type: DataTypes.BLOB('medium'),
		},
		http_response: {
			type: DataTypes.BLOB('medium'),
		},
	}, {
		tableName: 'AlarmReceipt',
		paranoid: false,
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	});
};
