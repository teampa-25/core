"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("InferenceJobs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      dataset_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Datasets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      video_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Videos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "RUNNING",
          "FAILED",
          "ABORTED",
          "COMPLETED",
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },
      params: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      carbon_footprint: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("InferenceJobs");
  },
};
