import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * This utils function helps to catch async errors in express routes
 * @param fn The function to be wrapped
 * @returns A function that wraps the original function and catches any errors
 */
export function catchAsync(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
