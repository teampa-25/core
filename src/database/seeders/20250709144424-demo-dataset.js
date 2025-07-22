/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";

const { randomInt } = require("crypto");
const { v4: uuidv4 } = require("uuid");

const tags = [
  "traffic-analysis",
  "computer-vision",
  "machine-learning",
  "deep-learning",
  "image-processing",
  "object-detection",
  "pattern-recognition",
  "video-analysis",
  "data-analytics",
  "sensor-data",
  "real-time",
  "neural-networks",
  "autonomous-vehicles",
  "big-data",
];

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  get_id: async (qi, s, user_email) => {
    const [results] = await qi.sequelize.query(
      'SELECT id FROM "User" WHERE email = :email LIMIT 1',
      {
        replacements: { email: user_email },
        type: s.QueryTypes.SELECT,
      },
    );
    if (!results) {
      throw new Error("User with email " + user_email + " not found");
    }
    return results["id"];
  },

  add_dataset: async (qi, s, user_email) => {
    const { faker } = require("@faker-js/faker");
    let uid = await module.exports.get_id(qi, s, user_email);
    await qi.bulkInsert("Dataset", [
      {
        id: uuidv4(),
        user_id: uid,
        name: faker.word.words({ count: { min: 2, max: 8 } }),
        tags: faker.helpers.arrayElements(tags, 6),
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  up: async (qi, s) => {
    const [results] = await qi.sequelize.query('SELECT email FROM "User"');
    for (const element of results) {
      let n = randomInt(10);
      for (let i = 0; i < n; i++) {
        await module.exports.add_dataset(qi, s, element.email);
      }
    }
  },
  down: async (qi) => {
    await qi.bulkDelete("Dataset", null, {});
  },
};
