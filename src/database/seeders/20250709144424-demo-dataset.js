"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Dataset",
      [
        {
          id: "750e8400-e29b-41d4-a716-446655440000",
          user_id: "550e8400-e29b-41d4-a716-446655440001", // user1@example.com
          name: "Traffic Analysis Dataset",
          tags: ["traffic-analysis", "computer-vision"],
          deleted_at: null,
          created_at: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "750e8400-e29b-41d4-a716-446655440003",
          user_id: "550e8400-e29b-41d4-a716-446655440001", // user1@example.com
          name: "Deleted Dataset",
          tags: ["test"],
          deleted_at: new Date(),
          created_at: new Date(Date.now() - 86400000), // 1 day ago
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Dataset", null, {});
  },
};
