import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { UserPayload } from "../@types/CustomUser";
import fs from "fs";

const publicKey = fs.readFileSync(config.jwtPublicKeyPath, "utf8");

/**
 * Middleware to authenticate user based on JWT token.
 * It checks for the presence of a Bearer token in the Authorization header,
 * verifies the token, and attaches the user payload to the request object.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    let decodedJWT = jwt.verify(token, publicKey);
    if (!decodedJWT) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Invalid token" });
    }

    req.user = <UserPayload>decodedJWT;
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).send({
      message: "Unauthorized",
    });
  }
  next();
};

/**
 * Middleware to authorize user based on roles.
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
    }
    next();
  };
};
