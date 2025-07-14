import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { validate } from "@/middlewares/validate.middleware";
import { UserSchema } from "@/utils/validation-schema";

const userController = new UserController();
const router = Router();

router.post(
  "/register",
  validate(UserSchema.register),
  userController.register,
);
router.post("/login", validate(UserSchema.login), userController.login);

export default router;
