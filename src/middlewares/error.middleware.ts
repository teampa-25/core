import { Response, Request, NextFunction } from "express";
import { ErrorObj, getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";

/**
 * Middleware function to handle 404 errors.
 * @param req - The request object
 * @param res - The response object
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorObj = getError(ErrorEnum.NOT_FOUND_ERROR)!;
  const { status, msg } = errorObj.getErrorObj();
  res.status(status).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found: ${msg}`,
  });
};

/**
 * Middleware function to convert errors to ApiError ErrorObj.
 * First check is the err is an ErrorObj, if it is it's passed to next middleware
 * otherwise is converted to Generic error (500)
 */
export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err && typeof err.getErrorObj === "function") {
    return next(err);
  }

  const errorObj = getError(ErrorEnum.GENERIC_ERROR)!;
  const { status, msg } = errorObj.getErrorObj();

  const convertedError: ErrorObj = {
    getErrorObj: () => ({ status, msg }),
  };

  next(convertedError);
};

/**
 * Middleware function to handle errors and send a JSON response.
 */
export const errorHandler = (
  err: ErrorObj,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err && typeof err.getErrorObj === "function") {
    const { status, msg } = (err as ErrorObj).getErrorObj();
    res.status(status).json({
      success: false,
      error: msg,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
};
