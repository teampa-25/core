import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtUtils } from "@/utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Missing token" });
  }

  try {
    const payload = JwtUtils.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Invalid token" });
  }
}
