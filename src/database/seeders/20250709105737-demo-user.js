"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "testuser",
          email: "test@example.com",
          password: "hashedpassword",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "adminuser",
          email: "admin@example.com",
          password: "hashedpassword",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
