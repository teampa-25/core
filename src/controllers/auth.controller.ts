import jwt from "jsonwebtoken";
import fs from "fs"
import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";

export class AuthController {
  // private privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY, "utf8");

  async login(rh: RequestHandler): Promise<object> {
    // const { req, res } = rh
    // const { email, password } = req.body;
    return {}
  }

  async register(rh: RequestHandler): Promise<object> {
    // const { req, res } = rh
    // const { email, password } = req.body;
    return {}
  }
}

