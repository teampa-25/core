import bcrypt from "bcrypt";
import { UserModel } from "@/models/user";
import { JwtUtils } from "@/utils/jwt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "@/models/enums/user.role";


export class AuthController {
  static async register(req: Request, res: Response):Promise<Response> {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing required fields",
      });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid role",
      });
    }

    try {
      const exists = await UserModel.findOne({ where: { email } });
      if (exists) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Email already registered",
        });
      }

      const user = await UserModel.create({
        email,
        password: await bcrypt.hash(password, 10),
        role,
      });

      return res.status(StatusCodes.CREATED).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  static async login(req: Request, res: Response):Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing email or password",
      });
    }

    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid credentials",
        });
      }

      const token = JwtUtils.generateToken({ id: user.id, email: user.email, role: user.role });

      return res.status(StatusCodes.OK).json({
        message: "Login successful",
        token,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
}
