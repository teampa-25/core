import { UserRole } from "@/models/enums/user.role";
import Joi from "joi";

export const UserSchema = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    credits: Joi.number().min(0).required(),
    role: Joi.string().equal(UserRole).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  id: Joi.object({
    id: Joi.string().required(),
  }),
};
