"use strict";

const { randomInt } = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async insert(qi, s, ids) {
    const estimateCarbonFootprint = ({ model, device, durationMinutes }) => {
      const base = MODEL_EMISSIONS[model] || 0.5;
      const multiplier = DEVICE_MULTIPLIER[device] || 1;
      const time = durationMinutes || 10;
      return Math.round(base * multiplier * time);
    };
    const generateFrames = () => {
      // Generate startFrame between 0 and 1000
      const startFrame = faker.number.int({ min: 0, max: 900 });

      // Generate endFrame greater than startFrame by at least 1
      const endFrame = faker.number.int({
        min: startFrame + 1,
        max: startFrame + 100,
      });

      // Generate frameStep > 1, say between 2 and 10
      const frameStep = faker.number.int({ min: 2, max: 10 });

      // goalFrameId strictly between start and end
      const goalFrameId = faker.number.int({
        min: startFrame,
        max: endFrame,
      });

      return {
        startFrame,
        endFrame,
        frameStep,
        goalFrameId,
      };
    };
    const statuses = ["PENDING", "RUNNING", "FAILED", "ABORTED", "COMPLETED"];
    const detectors = ["AKAZE, ORB, SIFT"];
    const fakeFrames = generateFrames();
    const MODEL_EMISSIONS = {
      cns: 0.6, // gCO₂ per minute
    };
    const DEVICE_MULTIPLIER = {
      cpu: 1,
      gpu: 1.8,
    };
    const durationMinutes = randomInt(1, 60);
    const model = faker.helpers.arrayElement(MODEL_EMISSIONS);
    const device = faker.helpers.arrayElement(DEVICE_MULTIPLIER);
    await qi.bulkInsert("InferenceJob", [
      {
        id: uuidv4(),
        dataset_id: ids.dataset_id,
        user_id: ids.user_id,
        goal_id: ids.video_id,
        current_id: ids.video_id,
        status: faker.helpers.arrayElement(statuses),
        params: JSON.stringify({
          startFrame: fakeFrames.startFrame,
          endFrame: fakeFrames.endFrame,
          frameStep: fakeFrames.frameStep,
          goalFrameId: fakeFrames.goalFrameId,
          detector: faker.helpers.arrayElement(detectors),
          useGpus: faker.datatype.boolean(0.7),
        }),
        carbon_footprint: estimateCarbonFootprint({
          model,
          device,
          durationMinutes,
        }),
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
