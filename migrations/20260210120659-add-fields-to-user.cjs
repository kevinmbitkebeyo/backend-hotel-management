'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('Users', 'firstname', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Users', 'lastname', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      unique: true
    });

    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      defaultValue: 'user'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'firstname');
    await queryInterface.removeColumn('Users', 'lastname');
    await queryInterface.removeColumn('Users', 'email');
    await queryInterface.removeColumn('Users', 'role');
  }
};
