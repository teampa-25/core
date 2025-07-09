"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "admin@example.com",
          password:
            "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
          role: "admin",
          tokens: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          email: "user1@example.com",
          password:
            "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
          role: "user",
          tokens: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          email: "user2@example.com",
          password:
            "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
          role: "user",
          tokens: 50,
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
