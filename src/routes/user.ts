import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/models/enums/user.role";

const router = Router();
const userController = new UserController();

router.use(authenticate, authorize(UserRole.USER, UserRole.ADMIN));
router.get("/credits", userController.credits);

export default router;
