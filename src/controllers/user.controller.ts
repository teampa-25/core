import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "@/services/user.service";
import { catchAsync } from "@/utils/catchAsync";

export class UserController {
  private userService = new UserService();

  register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user = await this.userService.create(email, password);
      return res.status(StatusCodes.CREATED).json({
        message: "User registered successfully",
        user: user,
      });
    },
  );

  login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);

      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid email or password",
        });
      }

      return res.status(StatusCodes.OK).json({
        message: "Login successful",
        token,
      });
    },
  );

  credits = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // req.user is guaranteed by the middleware
      const credits = await this.userService.getCreditsByUserId(req.user!.id);

      if (!credits) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Credits not found" });
      }

      return res.status(StatusCodes.OK).json({
        credits: credits,
      });
    },
  );

  recharge = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, credits } = req.body;
      const newBalance = await this.userService.addCreditsByUserEmail(
        email,
        credits,
      );

      if (!newBalance) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Credits not found" });
      }

      return res.status(StatusCodes.OK).json({
        message: "User's credits updated",
        newBalance: newBalance,
      });
    },
  );
}
