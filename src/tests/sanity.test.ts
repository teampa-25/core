import app from "@/app";
import { UserService } from "@/services/user.service";

// this basically just checks if jest is running correctly
describe("Basic Setup Test", () => {
  it("should not fail", () => {
    expect(true).toBe(true);
  });

  it("should have app defined", () => {
    expect(app).toBeDefined();
  });

  it("should have UserService defined", () => {
    expect(UserService).toBeDefined();
  });
});
