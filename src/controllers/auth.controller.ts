import jwt from "jsonwebtoken";
import fs from "fs"
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export class AuthController {
  // private privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY, "utf8");

  async login(req: Request, res: Response): Promise<void> {
    //const { req, res } = rh
    const { email, password } = req.body;

    //Change once the JWT private key is set
    res.status(StatusCodes.OK).json({ message: "Login successful", email });
    //return {}
  }

  async register(req: Request, res: Response): Promise<void> {
    //const { req, res } = rh
    const { email, password } = req.body;

    //Change once the JWT private key is set
    res.status(StatusCodes.OK).json({ message: "Registration successful", email });
    //return {}
  }
}

