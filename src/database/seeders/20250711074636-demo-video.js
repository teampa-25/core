"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import("sequelize-cli").Seed} */
module.exports = {
  async up(qi, _) {
    const { faker } = require("@faker-js/faker");
    const [results] = await qi.sequelize.query('SELECT id FROM "Dataset"');

    const [user] = await qi.sequelize.query(`
      SELECT u.id AS user_id, d.id AS dataset_id, v.id AS video_id
      FROM "User" AS u
      JOIN "Dataset" AS d ON u.id = d.user_id
    `);

    for (const element of results) {
      let video_id = uuidv4();
      await qi.bulkInsert("Video", [
        {
          id: video_id,
          dataset_id: element.id,
          file: `/files/${user.id}/videos/${video_id}.mp4`,
          name: faker.word.words({ count: 3 }),
          frame_count: 1500,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down(qi, _) {
    await qi.bulkDelete("Video", null, {});
  },
};
