import request from "supertest";
import app from "@/app";
import { StatusCodes } from "http-status-codes";
import { UserService } from "@/services/user.service";

const user_email = "a_new_user@example.org";
const password = "a_new_user_password";
let token = "";

describe("Authenticate middleware", () => {
  beforeAll(async () => {
    try {
      await new UserService().delete(user_email);
    } catch {}
  });

  afterAll(async () => {
    try {
      await new UserService().delete(user_email);
    } catch {}
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: user_email,
      password: password,
    });

    expect(res.statusCode).toBe(StatusCodes.CREATED);
  });

  it("should login user and return token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user_email,
      password: password,
    });

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).toBeTruthy();
    expect(typeof res.body.token).toBe("string");
    token = res.body.token;
  });

  it("should allow user to perform action (get credits)", async () => {
    const res = await request(app)
      .get("/api/user/credits")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty("credits");
    expect(typeof res.body.credits).toBe("number");
  });

  it("should reject unauthenticated requests", async () => {
    const res = await request(app).get("/api/user/credits");

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .get("/api/user/credits")
      .set("Authorization", "Bearer vera_baddie_token");

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should reject invalid invalid password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user_email,
      password: "vera_baddie_is_not_the_password",
    });

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});
