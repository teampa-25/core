import { Response, Request, NextFunction } from "express";
import { ErrorObj, getError } from "@/common/utils/api-error";
import { ErrorEnum } from "@/common/enums";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware function to handle 404 errors.
 * @param req - The request object
 * @param res - The response object
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorObj = getError(ErrorEnum.NOT_FOUND_ERROR)!;

  const { status, msg } = errorObj.toJSON();

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
  err: ErrorObj | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ErrorObj) {
    return next(err);
  } else if (err instanceof Error) {
    const convertedError = new ErrorObj(
      StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      ErrorEnum.GENERIC_ERROR,
    );
    next(convertedError);
  } else next(getError(ErrorEnum.GENERIC_ERROR));
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
  if (err instanceof ErrorObj) {
    const { status, msg } = (err as ErrorObj).toJSON();
    res.status(status).json({
      success: false,
      error: msg,
      method: req.method,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Nobody knows what happened",
      method: req.method,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};
