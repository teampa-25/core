import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Test route is working!",
  });
});

export default router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/v1/test:
 *   get:
 *     tags:
 *        - Test
 *     summary: Test route
 *     responses:
 *       200:
 *         description: Test route is working!
 */
