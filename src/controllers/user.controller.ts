import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "@/services/user.service";
import { catchAsync } from "@/common/utils/catchAsync";

export class UserController {
  private userService = new UserService();

  register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password, role } = req.body;
      const user = await this.userService.createUser(email, password, role);
      return res.status(StatusCodes.CREATED).json({
        message: "User registered successfully",
        user: user,
      });
    },
  );

  login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const token = await this.userService.loginUser(email, password);
      return res.status(StatusCodes.OK).json({
        message: "Login successful",
        token,
      });
    },
  );
}
