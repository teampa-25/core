import { UserController } from "@/controllers/user.controller";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/models/enums/user.role";
import { Router } from "express";

const router = Router();
const userController = new UserController();

// router.get("/init", databaseController.create);
// router.put("/:id", datasetController.updateById);
// router.delete("/:id", datasetController.deleteById);
//router.post("/recharge", authorize(UserRole.ADMIN), userController.create);

export default router;
