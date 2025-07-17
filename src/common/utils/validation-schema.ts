import { UserRole } from "@/common/enums";
import Joi from "joi";

/**
 * Schema for validating the id parameter
 */
export const IdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * Schema for validating the user registration login
 * and user recharge data
 */
export const UserSchema = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    // credits: Joi.number().min(0).required(),
    // role: Joi.string().equal(UserRole).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  recharge: Joi.object({
    email: Joi.string().email().required(),
    credits: Joi.number().min(0).required(),
  }),
};

/**
 * Schema for validating the dataset CRUD operations
 */
export const DatasetSchema = {
  get: Joi.object({
    tags: Joi.array().items(Joi.string()).optional(),
  }),
  create: Joi.object({
    name: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  uploadVideo: Joi.object({
    type: Joi.string().valid("video", "zip").required(),
    name: Joi.string().required(),
  }),

  removeVideo: Joi.object({
    videos: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
        }),
      )
      .required(),
  }),
};

/**
 * Schema for validating the inference creation
 */
export const InferenceSchema = {
  create: Joi.object({
    datasetId: Joi.string().uuid().required(),
    parameters: Joi.object({
      startFrame: Joi.number().integer().min(0).required(),
      endFrame: Joi.number().integer().min(0).required(),
      frameStep: Joi.number().integer().min(1).required(),
      detector: Joi.string().valid("AKAZE", "SIFT", "ORB").required(),
      useGpus: Joi.boolean().required(),
    }).required(),
    range: Joi.string()
      .pattern(/^all$|^\d+-\d+$/)
      .required(),
  }),
};
