import request from "supertest";
import app from "../app";
import { StatusCodes } from "http-status-codes";

describe("Authenticate middleware", () => {
  it("Authenticate JWT", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "anewuseremailiscreatedhere@example.org",
      password: "userpassword",
    });

    expect(res.statusCode).toBe(StatusCodes.CREATED);
  });
});
