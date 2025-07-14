import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "@/services/user.service";

export class UserController {
  private userService = new UserService();

  register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    const user = await this.userService.createUser(email, password, role);

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      user: user,
    });
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.loginUser(email, password);

      return res.status(StatusCodes.OK).json({
        message: "Login successful",
        token,
      });
    } catch (err: unknown) {
      console.error("Login error:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  };
}
