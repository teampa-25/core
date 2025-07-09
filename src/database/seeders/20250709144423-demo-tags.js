"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Tags",
      [
        {
          id: "650e8400-e29b-41d4-a716-446655440000",
          name: "machine-learning",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "650e8400-e29b-41d4-a716-446655440001",
          name: "computer-vision",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "650e8400-e29b-41d4-a716-446655440002",
          name: "object-detection",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "650e8400-e29b-41d4-a716-446655440003",
          name: "surveillance",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "650e8400-e29b-41d4-a716-446655440004",
          name: "traffic-analysis",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tags", null, {});
  },
};
