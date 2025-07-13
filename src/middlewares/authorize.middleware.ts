import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "@/models/enums/user.role";

export function authorize(...allowedRoles: UserRole[]) {
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
