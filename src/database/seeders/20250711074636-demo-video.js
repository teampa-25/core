"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import("sequelize-cli").Seed} */
module.exports = {
  async up(qi, _) {
    const { faker } = require("@faker-js/faker");
    const [results] = await qi.sequelize.query('SELECT id FROM "Dataset"');

    const user = await qi.sequelize.query(
      'SELECT u.id FROM "User" as u JOIN "Dataset" as d ON u.id = d.user_id JOIN "Video" as v ON d.id = v.dataset_id',
    );

    for (const element of results) {
      let video_id = uuidv4();
      await qi.bulkInsert("Video", [
        {
          id: video_id,
          dataset_id: element.id,
          file: `/files/${user.id}/videos/${video_is}.mp4`,
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
