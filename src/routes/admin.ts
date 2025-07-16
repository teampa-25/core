import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { UserController } from "@/controllers/user.controller";
import { UserRole } from "@/common/enums";
import { UserSchema } from "@/common/utils/validation-schema";
import { Router } from "express";
import { serverAdapter } from "@/config/bull-board";
import { logger } from "@/config/logger";

const router = Router();
const userController = new UserController();

router.post(
  "/recharge",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(UserSchema.recharge),
  userController.recharge,
);

// DEBUG
router.use("/queues", (req, res, next) => {
  logger.info(`Accesso alla Bull Board: ${req.url}`);
  return serverAdapter.getRouter()(req, res, next);
});
export default router;
