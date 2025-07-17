import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "@/common/utils/jwt";
import { getError } from "@/common/utils/api-error";
import { UserPayload } from "@/common/types";
import { ErrorEnum } from "@/common/enums";

/**
 * Middleware to authenticate requests
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // get authorization header and perform every check on jwt format
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = getError(ErrorEnum.BAD_REQUEST_ERROR);
      throw error;
    }

    const tokenParts = authHeader.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      const error = getError(ErrorEnum.INVALID_JWT_FORMAT);
      throw error;
    }

    const token = tokenParts[1];

    if (!token) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR);
      throw error;
    }

    // decode jwt and extract payload (converted into UserPayload)
    const payload = JwtUtils.verifyToken(token);
    req.user = <UserPayload>payload;

    next();
  } catch (err) {
    const error = getError(ErrorEnum.UNAUTHORIZED_ERROR).toJSON();
    res.status(error?.status || 403).json({
      message: error?.msg || "Invalid or expired token",
    });
    next(err);
  }
}
