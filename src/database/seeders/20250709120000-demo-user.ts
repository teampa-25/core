import { QueryInterface } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("Users", [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "admin@example.com",
        password: "hashedpassword",
        role: "admin",
        tokens: 100,
        createdAt: new Date(),
      },
      {
        id: "34234567-e89b-12d3-a456-426614174001",
        email: "user@example.com",
        password: "hashedpassword",
        role: "user",
        tokens: 50,
        createdAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("Users", {}, {});
  },
};
