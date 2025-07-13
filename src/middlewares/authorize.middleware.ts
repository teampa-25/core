import { Request, Response, NextFunction } from "express";
import { UserRole } from "@/models/enums/user.role";
import { getError, ErrorEnum } from "@/utils/api-error";

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
