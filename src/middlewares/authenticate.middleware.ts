import { Request, Response, NextFunction } from "express";
import { JwtUtils } from "@/utils/jwt";
import { ErrorEnum, getError } from "@/utils/api-error";
import { th } from "@faker-js/faker/.";


interface UserPayload{
  id: string,
  email: string,
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload; 
    }
  }
}


export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    const error = getError(ErrorEnum.UNAUTHORIZED_ERROR)?.getErrorObj();
    return res.status(error.status).json({ message: error.msg });
  }

  try {
    const payload = JwtUtils.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    const error = getError(ErrorEnum.FORBIDDEN_ERROR)?.getErrorObj();
    return res.status(error.status).json({ message: error.msg });
  }

  next();
}


export function authenticate2(req: Request, res: Response, next: NextFunction){
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR)?.getErrorObj();
      throw(error)
    }

    const tokenParts = authHeader.split(' ');
    
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      const error = getError(ErrorEnum.INVALID_JWT_FORMAT)?.getErrorObj();
      throw(error)
    }

    const token = tokenParts[1];

    if (!token) {
      const error = getError(ErrorEnum.UNAUTHORIZED_ERROR)?.getErrorObj();
      throw(error)
    }

    const payload = JwtUtils.verifyToken(token);
    
    req.user = <UserPayload>payload;
    
    next();
    
  } catch (err) {
    const error = getError(ErrorEnum.FORBIDDEN_ERROR)?.getErrorObj();
    res.status(error?.status || 403).json({ 
      message: error?.msg || 'Invalid or expired token' 
    });
    next(err)
  }
}
