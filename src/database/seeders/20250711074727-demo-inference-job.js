"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("InferenceJob", [
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        dataset_id: "750e8400-e29b-41d4-a716-446655440000", // Dataset 1
        user_id: "550e8400-e29b-41d4-a716-446655440000",    // User 1
        video_id: "750e8400-e29b-41d4-a716-446655440101",   // video 1
        status: "PENDING",
        params: JSON.stringify({
          threshold: 0.5,
          model: "yolov8",
        }),
        carbon_footprint: 25,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        dataset_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        user_id: "550e8400-e29b-41d4-a716-446655440001", // User 2
        video_id: "750e8400-e29b-41d4-a716-446655440102", // Video 2
        status: "RUNNING",
        params: JSON.stringify({
          threshold: 0.7,
          model: "yolov5",
        }),
        carbon_footprint: 42,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("InferenceJob", null, {});
  },
};
