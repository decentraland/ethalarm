/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Alarm', {
		id: {
			type: DataTypes.UUID,
			allowNull: true,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		address: {
			type: DataTypes.STRING(42),
			allowNull: false
		},
		abi: {
			type: DataTypes.STRING(65534),
			allowNull: false
		},
		event_names: {
			type: DataTypes.STRING(512),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(254),
		},
		url: {
			type: DataTypes.STRING(2000),
		},
		block_confirmations: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '1'
		},
		confirmation_code: {
			type: DataTypes.UUID,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		enabled: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: false,
		},
	}, {
		tableName: 'Alarm',
		paranoid: true,
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		deletedAt: 'deleted_at',
	});
};
