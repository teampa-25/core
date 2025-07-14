import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { UserController } from "@/controllers/user.controller";
import { UserRole } from "@/models/enums/user.role";
import { UserSchema } from "@/utils/validation-schema";
import { Router } from "express";

const router = Router();
const userController = new UserController();

router.use(authenticate, authorize(UserRole.ADMIN));
router.post(
  "/recharge",
  validate(UserSchema.recharge),
  userController.recharge,
);

export default router;
