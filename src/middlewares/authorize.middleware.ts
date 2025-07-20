import { Request, Response, NextFunction } from "express";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum, UserRole } from "@/common/enums";
import { UserPayload } from "@/common/types";

/**
 * Middleware to authorize requests based on user roles
 * @param allowedRoles - The allowed roles for the request
 * @returns A middleware function
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = <UserPayload>req.user;

      if (!user || !allowedRoles.includes(user.role as UserRole)) {
        throw getError(ErrorEnum.FORBIDDEN_ERROR);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
