import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import fs from "fs";
import type { StringValue } from "ms";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../utils/catchAsync";
import { UserService } from "../services/user.service";

export class UserController {
  private privateKey = fs.readFileSync(config.jwtPrivateKeyPath, "utf8");
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email, password, and role are required" });
      return;
    }

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      res.status(StatusCodes.CONFLICT).json({ message: "User already exists" });
      return;
    }

    const newUser = await this.userService.register({ email, password, role });

    res.status(StatusCodes.CREATED).json({ user: newUser });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.userService.loginWithEmailAndPassword(
      email,
      password,
    );

    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      this.privateKey,
      { expiresIn: config.jwtExpiration as StringValue },
    );

    res.status(StatusCodes.OK).json({ user, token });
  });
}

/**
 * @swagger
 * api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             email: user@example.com
 *             password: secret123
 *     responses:
 *       '200':
 *         description: Successful login
 *       '401':
 *         description: Unauthorized – invalid credentials
 *
 *   @swagger
 *    api/v1/auth/register:
 *      post:
 *        summary: User registration
 *        tags:
 *          - Authentication
 *        requestBody:
 *          description: User registration information
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                required:
 *                  - email
 *                  - password
 *                  - role
 *                properties:
 *                  email:
 *                    type: string
 *                    format: email
 *                  password:
 *                    type: string
 *                    format: password
 *                  role:
 *                    type: string
 *                    enum: [user, admin]
 *              example:
 *                email: user@example.com
 *                password: secret123
 *                role: user
 *        responses:
 *          '201':
 *            description: User registered successfully
 *          '400':
 *            description: Bad request – invalid input
 *          '409':
 *            description: Conflict – user already exists
 */
