'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('AlarmReceipt', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			alarm_id: {
				type: Sequelize.UUID,
				references: {
					model: 'Alarm',
					key: 'id'
				},
				allowNull: false,
			},
			tx_hash: {
				type: Sequelize.STRING(66),
				allowNull: false,
			},
			smtp_response: {
				type: Sequelize.BLOB('medium'),
			},
			http_response: {
				type: Sequelize.BLOB('medium'),
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('AlarmReceipt');
	}
};
