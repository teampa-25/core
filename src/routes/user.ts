import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { validate } from "@/middlewares/validate.middleware";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/common/enums";
import { UserSchema } from "@/common/utils/validation-schema";

const router = Router();
const userController = new UserController();

router.use(authenticate, authorize(UserRole.USER, UserRole.ADMIN));
router.get("/credits", userController.credits);

export default router;
