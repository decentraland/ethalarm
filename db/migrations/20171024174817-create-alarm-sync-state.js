'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('alarm_sync_state', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			alarm_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: 'alarm',
					key: 'id'
				}
			},
			last_sync_block: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: '0',
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('alarm_sync_state');
	}
};
