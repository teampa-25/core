import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "@/common/utils/jwt";
import { getError } from "@/common/utils/api-error";
import { UserPayload } from "@/common/types";
import { ErrorEnum } from "@/common/enums";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR)?.getErrorObj();
      throw error;
    }

    const tokenParts = authHeader.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      const error = getError(ErrorEnum.INVALID_JWT_FORMAT)?.getErrorObj();
      throw error;
    }

    const token = tokenParts[1];

    if (!token) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR)?.getErrorObj();
      throw error;
    }

    const payload = JwtUtils.verifyToken(token);

    req.user = <UserPayload>payload;

    next();
  } catch (err) {
    const error = getError(ErrorEnum.FORBIDDEN_ERROR)?.getErrorObj();
    res.status(error?.status || 403).json({
      message: error?.msg || "Invalid or expired token",
    });
    next(err);
  }
}
