"use strict";

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
    return queryInterface.bulkInsert(
      "AlarmSyncState",
      [
        {
          id: 1,
          Alarm_id: "3411d22e-d454-4bf3-aab1-2e711c9879bb",
          last_sync_block: 4446530
        },
        {
          id: 2,
          Alarm_id: "3411d22e-d454-4bf3-aab1-2e711c9879bc",
          last_sync_block: 1233312
        },
        {
          id: 3,
          Alarm_id: "3411d22e-d454-4bf3-aab1-2e711c9879bd",
          last_sync_block: 0
        },
        {
          id: 4,
          Alarm_id: "3411d22e-d454-4bf3-aab1-2e711c9879be",
          last_sync_block: 33
        }
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    /*
			Add reverting commands here.
			Return a promise to correctly handle asynchronicity.

			Example:
			return queryInterface.bulkDelete('Person', null, {});
		*/
    queryInterface.bulkDelete("AlarmSyncState", null, {});
  }
};
