import { UserController } from "@/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/models/enums/user.role";
import { Router } from "express";

const router = Router();
const userController = new UserController();

router.use(authenticate(req, res, next));
router.use(authorize(UserRole.ADMIN));

router.post("/recharge", userController.create);

export default router;
