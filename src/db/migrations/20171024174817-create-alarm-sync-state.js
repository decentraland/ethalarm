'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('AlarmSyncState', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			Alarm_id: {
				type: Sequelize.UUIDV4,
				allowNull: false,
				references: {
					model: 'Alarm',
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
		return queryInterface.dropTable('AlarmSyncState');
	}
};
