'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
			Add altering commands here.
			Return a promise to correctly handle asynchronicity.

			Example:
			return queryInterface.bulkInsert('Person', [{
				name: 'John Doe',
				isBetaMember: false
			}], {});
		*/
		return queryInterface.bulkInsert('AlarmReceipt', [
      {
        id: 1,
        Alarm_id: '3411d22e-d454-4bf3-aab1-2e711c9879bc',
        event_name: 'Trade',
        tx_hash: '0x5c8c0ce953202c42a13ae1183e86ade8ca08440774fb6b2fc23909f16b5dfe0e',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        Alarm_id: '3411d22e-d454-4bf3-aab1-2e711c9879bd',
        event_name: 'Deposit',
        tx_hash: '0x5c8c0ce953202c42a13ae1183e86ade8ca08440774fb6b2fc23909f16b5dfe0e',
        created_at: new Date(),
        updated_at: new Date()
      },
		], {});
	}, down: (queryInterface, Sequelize) => {
		/*
			Add reverting commands here.
			Return a promise to correctly handle asynchronicity.

			Example:
			return queryInterface.bulkDelete('Person', null, {});
		*/
		queryInterface.bulkDelete('AlarmReceipt', null, {});
	}
};
