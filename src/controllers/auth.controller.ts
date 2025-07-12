import jwt from "jsonwebtoken";
import fs from "fs"
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { Database } from "@/database/database";

export class AuthController {

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    //Change once the JWT private key is set -cate
    res.status(StatusCodes.OK).json({ message: "Login successful", email });
  }

  async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    //Change once the JWT private key is set -cate
    res.status(StatusCodes.OK).json({ message: "Registration successful", email });
  }
}

