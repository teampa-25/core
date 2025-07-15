import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { UserController } from "@/controllers/user.controller";
import { UserRole } from "@/common/enums";
import { UserSchema } from "@/common/utils/validation.schema";
import { Router } from "express";
import { serverAdapter } from "@/config/bull-board";

const router = Router();
const userController = new UserController();

router.use(authenticate, authorize(UserRole.ADMIN));
router.post(
  "/recharge",
  validate(UserSchema.recharge),
  userController.recharge,
);

router.use("/queues", serverAdapter.getRouter());
export default router;
