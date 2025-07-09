import { Router } from "express";
import { UserController } from "../../controllers/user.controller";

const router = Router();

const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

// POST /api/v1/auth/register
router.post("/register", userController.register);

// POST /api/v1/auth/login
router.post("/login", userController.login);

export default router;
