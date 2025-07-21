import { validate } from "@/middlewares/validate.middleware";
import {
  UserSchema,
  IdSchema,
  InferenceSchema,
} from "@/common/utils/validation-schema";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

describe("Validation Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("UserSchema.register validation", () => {
    const middleware = validate(UserSchema.register, "body");

    it("should call next and sanitize valid data", () => {
      req.body = {
        email: "test@example.com",
        password: "verabaddie",
      };

      middleware(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should respond 400 with errors on invalid data", () => {
      req.body = {
        email: "agugaga-not-email",
      };

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("IdSchema validation on params", () => {
    const middleware = validate(IdSchema, "params");

    it("should call next with valid UUID", () => {
      req.params = { id: "123e4567-e89b-12d3-a456-426614174000" };
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should respond 400 for invalid UUID", () => {
      req.params = { id: "not-a-uuid" };

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("InferenceSchema.create validation with custom rules", () => {
    const middleware = validate(InferenceSchema.create, "body");

    it("should pass valid input", () => {
      req.body = {
        datasetId: "123e4567-e89b-12d3-a456-426614174000",
        parameters: {
          startFrame: 0,
          endFrame: 10,
          frameStep: 1,
          goalFrameId: 5,
          detector: "AKAZE",
          useGpus: true,
        },
        range: "all",
      };

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail if startFrame >= endFrame", () => {
      req.body = {
        datasetId: "123e4567-e89b-12d3-a456-426614174000",
        parameters: {
          startFrame: 10,
          endFrame: 10,
          frameStep: 1,
          goalFrameId: 5,
          detector: "AKAZE",
          useGpus: true,
        },
        range: "all",
      };

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail if goalFrameId out of range", () => {
      req.body = {
        datasetId: "123e4567-e89b-12d3-a456-426614174000",
        parameters: {
          startFrame: 0,
          endFrame: 10,
          frameStep: 1,
          goalFrameId: 10, // invalid, should be < endFrame
          detector: "AKAZE",
          useGpus: true,
        },
        range: "all",
      };

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail if frameStep too large", () => {
      req.body = {
        datasetId: "123e4567-e89b-12d3-a456-426614174000",
        parameters: {
          startFrame: 0,
          endFrame: 10,
          frameStep: 10, // invalid, should be < endFrame-startFrame
          goalFrameId: 5,
          detector: "AKAZE",
          useGpus: true,
        },
        range: "all",
      };

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail if range is invalid", () => {
      req.body = {
        datasetId: "123e4567-e89b-12d3-a456-426614174000",
        parameters: {
          startFrame: 0,
          endFrame: 10,
          frameStep: 1,
          goalFrameId: 5,
          detector: "AKAZE",
          useGpus: true,
        },
        range: "10-5", // invalid because start >= end
      };

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
