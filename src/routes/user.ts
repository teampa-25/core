import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/common/enums";

const router = Router();
const userController = new UserController();

router.use(authenticate, authorize(UserRole.USER, UserRole.ADMIN));
// get user's credits
router.get("/credits", userController.credits);

export default router;
