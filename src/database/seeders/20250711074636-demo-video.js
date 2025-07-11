"use strict";

/** @type {import("sequelize-cli").Seed} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Video", [
      {
        id: "750e8400-e29b-41d4-a716-446655440101",
        dataset_id: "750e8400-e29b-41d4-a716-446655440000", // Dataset 1
        file: Buffer.from("Fake video data 1"),
        name: "Sample Video 1",
        frame_count: 1500,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "750e8400-e29b-41d4-a716-446655440102",
        dataset_id: "750e8400-e29b-41d4-a716-446655440003", // Dataset 2
        file: Buffer.from("Fake video data 2"),
        name: "Sample Video 2",
        frame_count: 2300,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Video", {
      id: [
        "750e8400-e29b-41d4-a716-446655440101",
        "750e8400-e29b-41d4-a716-446655440102",
      ],
    });
  },
};


