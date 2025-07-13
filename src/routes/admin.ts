import { UserController } from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();
const userController = new UserController();

// router.get("/init", databaseController.create);
// router.put("/:id", datasetController.updateById);
// router.delete("/:id", datasetController.deleteById);
router.post("/createUser", userController.create);

export default router;
