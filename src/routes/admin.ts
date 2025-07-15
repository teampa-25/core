import { UserController } from "@/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/common/enums";
import { Router } from "express";

const router = Router();
const userController = new UserController();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.post("/recharge");

export default router;
