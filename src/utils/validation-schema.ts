import { UserRole } from "@/models/enums/user.role";
import Joi from "joi";

export const IdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

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
};

export const DatasetSchema = {
  create: Joi.object({
    name: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  addVideos: Joi.object({
    videos: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          type: Joi.string().valid("video", "zip").required(),
        }),
      )
      .required(),
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

export const InferenceSchema = {
  create: Joi.object({
    userId: Joi.string().uuid().required(),
    datasetId: Joi.string().uuid().required(),
    parameters: Joi.object({
      startFrame: Joi.number().integer().min(0).required(),
      endFrame: Joi.number().integer().min(0).required(),
      frameStep: Joi.number().integer().min(1).required(),
      detector: Joi.string().valid("AKAZE", "SIFT", "ORB").required(),
      useDevice: Joi.boolean().required(),
    }).required(),
    range: Joi.string()
      .pattern(/^all$|^\d+-\d+$/)
      .required(),
  }),
};
