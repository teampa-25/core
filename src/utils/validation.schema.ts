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
  get: Joi.object({
    tags: Joi.array().items(Joi.string()).optional(),
  }),
  create: Joi.object({
    name: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  uploadVideo: Joi.object({
    type: Joi.string().valid("video", "zip").required(),
    content: Joi.binary().required(),
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
