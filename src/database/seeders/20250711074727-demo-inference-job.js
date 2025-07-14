"use strict";

const crypt = require("bcrypt");
const { randomInt } = require("crypto");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async insert(qi, s, ids) {
    // NOTE: I know this is not ideal, but for some reason it doesn't work outside... -beg
    const { faker } = require("@faker-js/faker");
    // NOTE: this should be an Enum -beg
    const statuses = ["PENDING", "RUNNING", "FAILED", "ABORTED", "COMPLETED"];

    await qi.bulkInsert("InferenceJob", [
      {
        id: uuidv4(),
        dataset_id: ids.dataset_id,
        user_id: ids.user_id,
        goal_id: ids.video_id,
        current_id: ids.video_id,
        status: faker.helpers.arrayElement(statuses),
        params: JSON.stringify({
          threshold: 0.5,
          model: "cns",
        }),
        carbon_footprint: 25, // TODO: write a function that actually calculates it
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async up(qi, s) {
    const [results] = await qi.sequelize.query(`
      SELECT u.id AS user_id, d.id AS dataset_id, v.id AS video_id
      FROM "User" AS u
      JOIN "Dataset" AS d ON u.id = d.user_id
      JOIN "Video" AS v ON v.dataset_id = d.id
    `);

    console.log(results);
    for (const element of results) {
      await module.exports.insert(qi, s, element);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("InferenceJob", null, {});
  },
};
