const crypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;
const { faker } = require("@faker-js/faker")

module.exports = {
  add_user: async (qi, email, password, role, credit, id) => {
    await qi.bulkInsert(
      "User",
      [
        {
          id: id ?? uuidv4(),
          email,
          password,
          role,
          credit,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ]
    );
  },

  secure_add: async (qi, email, password, role, credit, id) => {
    const hash = await crypt.hash(password, saltRounds);
    await module.exports.add_user(qi, email, hash, role, credit, id);
  },

  up: async (qi, s) => {
    const admin_password = "verabaddie";
    const user_password = "chainconilmioname";
    const random_users_num = 100;

    await module.exports.secure_add(qi, "admin@infernode.example.org", admin_password, "admin", 100000);
    await module.exports.secure_add(qi, "user1@infernode.example.org", user_password, "user", 100);
    await module.exports.secure_add(qi, "user2@infernode.example.org", user_password, "user", 100);
    await module.exports.secure_add(qi, "user3@infernode.example.org", user_password, "user", 100);
    await module.exports.secure_add(qi, "user4@infernode.example.org", user_password, "user", 100);

    for (let i = 0; i < random_users_num; i++) {
      await module.exports.secure_add(qi, faker.internet.email(), faker.internet.password(), "user", 100);
    }
  },

  down: async (qi, s) => {
    await qi.bulkDelete("User", null, {});
  },
};
