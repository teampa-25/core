import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { UserController } from "@/controllers/user.controller";
import { UserRole } from "@/common/enums";
import { UserSchema } from "@/common/utils/validation-schema";
import { Router } from "express";

const router = Router();
const userController = new UserController();

//rechange user's credits
router.post(
  "/recharge",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(UserSchema.recharge),
  userController.recharge,
);

export default router;
