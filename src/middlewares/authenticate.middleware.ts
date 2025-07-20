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

    if (!authHeader) throw getError(ErrorEnum.BAD_REQUEST_ERROR);

    const tokenParts = authHeader.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      throw getError(ErrorEnum.BAD_REQUEST_ERROR);

    const token = tokenParts[1];

    if (!token) throw getError(ErrorEnum.UNAUTHORIZED_ERROR);

    // decode jwt and extract payload (converted into UserPayload)
    const payload = JwtUtils.verifyToken(token);
    req.user = <UserPayload>payload;
    throw new Error("strange");

    next();
  } catch (err) {
    next(err);
  }
}
