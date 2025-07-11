"use strict";

const { v4: uuidv4 } = require('uuid');
const { faker } = require("@faker-js/faker")

/** @type {import("sequelize-cli").Seed} */
module.exports = {
  async insert(qi, s, e) {

    const detections = Array.from({ length: 100 }, (_, i) => ({
      frame: i + 1,
      velocity_norm: faker.number.float({ min: 0, max: 9, precision: 1e-10 }),
      msg: "this is just a TEST --- more values needed"
    }));

    await qi.bulkInsert("Result", [
      {
        id: uuidv4(),
        inferenceJob_id: e.id, // InferenceJob 1
        json_res: JSON.stringify({ detections }),
        image_zip: Buffer.from("Fake ZIP content 1"), // NOTE: what's Buffer? -beg
        created_at: new Date(),
        updated_at: new Date(),
      }])
  },
  async up(qi, s) {
    const [results] = await qi.sequelize.query(`SELECT id FROM "InferenceJob"`);

    console.log(results)
    for (const element of results) {
      await module.exports.insert(qi, s, element);
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Result", null, {});
  },
};

