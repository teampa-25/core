import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "@/services/user.service";
import { catchAsync } from "@/common/utils/catchAsync";

/**
 * UserController is responsible for handling user-related operations.
 * It provides methods to register, login, get credits, and recharge credits for a user.
 */
export class UserController {
  private userService = new UserService();

  /**
   * Registers a new user.
   * @param req Request containing user details
   * @param res Response object to send back user details
   * @returns Promise resolving to the created user
   */
  register = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.userService.create(email, password);
    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      user: user,
    });
  });

  /**
   * Logs in a user.
   * @param req Request containing user credentials
   * @param res Response object to send back login status
   * @returns Promise resolving to the login status
   */
  login = catchAsync(async (req: Request, res: Response) => {
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
  });

  /**
   * Retrieves the credits for a user.
   * @param req Request containing the user ID
   * @param res Response object to send back the user's credits
   * @returns Promise resolving to the user's credits
   */
  credits = catchAsync(async (req: Request, res: Response) => {
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
  });

  /**
   * Recharges the credits for a user.
   * @param req Request containing the user's email and the amount of credits to recharge
   * @param res Response object to send back the new balance
   * @returns Promise resolving to the new balance
   */
  recharge = catchAsync(async (req: Request, res: Response) => {
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
  });
}
