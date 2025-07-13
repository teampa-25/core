import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtUtils } from "@/utils/jwt";
import { UserRole } from "@/models/enums/user.role";

export class AuthMiddleware {
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
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

  static authorizeRole(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "You do not have permission to access this resource",
        });
      }

      next();
    };
  }
}