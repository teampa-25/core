"use strict";

const crypt = require("bcrypt");
const { randomInt } = require("crypto");
const { v4: uuidv4 } = require("uuid");

/** @type {import("sequelize-cli").Seed} */
module.exports = {
  async up(qi, Sequelize) {
    const { faker } = require("@faker-js/faker");
    const [results] = await qi.sequelize.query('SELECT id FROM "Dataset"');

    console.log(results);
    const videos = [
      Buffer.from("Fake video data 1"),
      Buffer.from("Fake video data 2"),
    ];

    for (const element of results) {
      await qi.bulkInsert("Video", [
        {
          id: uuidv4(),
          dataset_id: element.id,
          file: faker.helpers.arrayElement(videos),
          name: faker.word.words({ count: 3 }),
          frame_count: 1500,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down(qi, Sequelize) {
    await qi.bulkDelete("Video", null, {});
  },
};
