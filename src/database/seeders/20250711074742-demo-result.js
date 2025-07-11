"use strict";

/** @type {import("sequelize-cli").Seed} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Result", [
      {
        id: "770e8400-e29b-41d4-a716-446655440001",
        inferenceJob_id: "660e8400-e29b-41d4-a716-446655440001", // InferenceJob 1
        json_res: JSON.stringify({
          detections: [
            { frame: 1, label: "person", confidence: 0.92 },
            { frame: 2, label: "car", confidence: 0.88 },
          ],
        }),
        image_zip: Buffer.from("Fake ZIP content 1"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440002",
        inferenceJob_id: "660e8400-e29b-41d4-a716-446655440002", // InferenceJob 2
        json_res: JSON.stringify({
          detections: [
            { frame: 5, label: "dog", confidence: 0.76 },
            { frame: 6, label: "cat", confidence: 0.85 },
          ],
        }),
        image_zip: Buffer.from("Fake ZIP content 2"),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Result", {
      id: [
        "770e8400-e29b-41d4-a716-446655440001",
        "770e8400-e29b-41d4-a716-446655440002",
      ],
    });
  },
};

