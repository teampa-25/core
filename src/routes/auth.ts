import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validate.middleware";
import { UserSchema } from "@/utils/validation-schema";

const router = Router();

const controller = new AuthController();


//router.post("/register", });
router.post("/login", validate(UserSchema.login), controller.login);

export default router;
