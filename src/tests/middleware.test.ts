// Import the middleware function
import { Request, Response, NextFunction } from "express";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { ErrorEnum, UserRole } from "@/common/enums";
import { UserPayload } from "@/common/types";
import { JwtUtils } from "@/common/utils/jwt";
import { authorize } from "@/middlewares/authorize.middleware";
import { User } from "@/models";

// Mock external dependencies
jest.mock("@/common/utils/api-error"); // Update path
jest.mock("@/common/utils/jwt"); // Update path

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

describe("Middleware", () => {
  describe("Authentication Middleware", () => {
    let req: Partial<AuthenticatedRequest>;
    let res: Partial<Response>;
    let next: NextFunction;
    let getErrorSpy: jest.SpyInstance;
    let jwtUtilsSpy: jest.SpyInstance;

    beforeEach(() => {
      req = {
        headers: {},
        user: undefined,
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      next = jest.fn();

      getErrorSpy = jest.spyOn(require("@/common/utils/api-error"), "getError");
      jwtUtilsSpy = jest.spyOn(JwtUtils, "verifyToken");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should throw BAD_REQUEST_ERROR when authorization header is missing", () => {
      req.headers = {};
      authenticate(req as AuthenticatedRequest, res as Response, next);
      expect(getErrorSpy).toHaveBeenCalledWith(ErrorEnum.BAD_REQUEST_ERROR);
    });

    it("should throw BAD_REQUEST_ERROR when authorization bearer is malformed", () => {
      req.headers = { authorization: "Bearer-aaaaa aaaa aaa aaa aaa" };
      authenticate(req as AuthenticatedRequest, res as Response, next);
      expect(getErrorSpy).toHaveBeenCalledWith(ErrorEnum.BAD_REQUEST_ERROR);
    });

    it("should throw BAD_REQUEST_ERROR when authorization header is missing", () => {
      req.headers = { authorization: "Bearer " };
      authenticate(req as AuthenticatedRequest, res as Response, next);
      expect(getErrorSpy).toHaveBeenCalledWith(ErrorEnum.UNAUTHORIZED_ERROR);
    });
  });

  describe("Authorization Middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let getErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      req = {
        headers: {},
        user: {
          id: "e2e04ada-d360-4c69-a38a-dc1a02bf44dd",
          email: "jest@jest.jest",
          role: UserRole.USER,
        } as UserPayload,
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      next = jest.fn();

      getErrorSpy = jest.spyOn(require("@/common/utils/api-error"), "getError");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should throw FORBIDDEN_ERROR if user is not ADMIN", () => {
      authorize(UserRole.ADMIN)(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );
      expect(getErrorSpy).toHaveBeenCalledWith(ErrorEnum.FORBIDDEN_ERROR);
    });

    it("should call next if user is USER", () => {
      authorize(UserRole.USER)(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );
      expect(next).toHaveBeenCalled();
      expect(getErrorSpy).not.toHaveBeenCalled();
    });

    it("should call next if multiple roles include user role", () => {
      authorize(UserRole.ADMIN, UserRole.USER)(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
      expect(getErrorSpy).not.toHaveBeenCalled();
    });
  });
});
