import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validate.middleware";
import { UserSchema } from "@/utils/validation-schema";

const router = Router();


router.post("/register", AuthController.register);
router.post("/login",validate(UserSchema.login), AuthController.login);

export default router;
