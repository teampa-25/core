import { Router } from "express";
import * as DatasetController from "@/controllers/dataset.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";

const router = Router();

// Crea un nuovo dataset
router.post("/", authenticate, DatasetController.createDataset);

// Cancella logicamente un dataset
router.delete("/:id", authenticate, DatasetController.deleteDataset);

// Ottieni la lista dei dataset (con filtro per tag)
router.get("/", authenticate, DatasetController.getDatasets);

// Aggiorna un dataset
router.put("/:id", authenticate, DatasetController.updateDataset);

// Aggiungi video o zip di video al dataset
router.post("/:id/videos", authenticate, DatasetController.addVideosToDataset);

// Ottieni un dataset per id (già presente)
router.get("/:id", authenticate, DatasetController.getDatasetById);

export default router;
