import { Request, Response, NextFunction } from "express";
import { getError } from "@/common/utils/api-error";
import { ErrorEnum, UserRole } from "@/common/enums";

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      const error = getError(ErrorEnum.FORBIDDEN_ERROR)?.getErrorObj();
      return res.status(error.status).json({
        message: error.msg,
      });
    }

    next();
  };
}
