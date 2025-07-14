import { Request, Response } from "express";
import { Dataset } from "@/models/dataset";
import { StatusCodes } from "http-status-codes";
import { DatasetService } from "@/services/dataset.service";

const datasetService = new DatasetService();

/**
 * Creates a new dataset
 * @param req
 * @param res
 * @returns a response with the created dataset or an error
 */
export const createDataset = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Utente non autenticato" });
    }

    const { name, tags } = req.body;
    const dataset = await datasetService.createDataset(userId, { name, tags });

    return res.status(StatusCodes.CREATED).json({
      message: "Dataset creato con successo",
      dataset,
    });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Errore nella creazione del dataset",
    });
  }
};

/**
 * Deletes a dataset
 * @param req
 * @param res
 * @returns a response indicating success or failure
 */
export const deleteDataset = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Utente non autenticato" });
    }

    const { id } = req.params;
    const deleted = await datasetService.deleteDataset(id, userId);

    if (!deleted) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Dataset non trovato" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Dataset cancellato con successo" });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Errore nella cancellazione del dataset",
    });
  }
};

/**
 * Gets the list of datasets for the authenticated user
 * @param req
 * @param res
 * @returns a response with the list of datasets
 */
export const getDatasets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Utente non autenticato" });
    }

    const { tags } = req.query;
    const filters = tags
      ? { tags: Array.isArray(tags) ? (tags as string[]) : [tags as string] }
      : undefined;

    const datasets = await datasetService.getDatasets(userId, filters);

    return res.status(StatusCodes.OK).json({ datasets });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Errore nel recupero dei dataset",
    });
  }
};

/**
 * Updates a dataset
 * @param req
 * @param res
 * @returns a response with the updated dataset or an error
 */
export const updateDataset = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Utente non autenticato" });
    }

    const { id } = req.params;
    const { name, tags } = req.body;

    const dataset = await datasetService.updateDataset(id, userId, {
      name,
      tags,
    });

    return res.status(StatusCodes.OK).json({
      message: "Dataset aggiornato con successo",
      dataset,
    });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Errore nell'aggiornamento del dataset",
    });
  }
};

/**
 * Adds videos to a dataset
 * @param req
 * @param res
 * @returns a response with the updated dataset or an error
 */
export const addVideosToDataset = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Utente non autenticato" });
    }

    const { id } = req.params;
    const videos = req.body.videos;

    const result = await datasetService.addVideosToDataset(id, userId, videos);

    return res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message || "Errore nell'aggiunta dei video",
    });
  }
};

/**
 * Gets a dataset by ID
 * @param req
 * @param res
 * @returns a response with the dataset or an error
 */
export const getDatasetById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const dataset = await Dataset.findByPk(id);
    if (!dataset) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Dataset not found" });
    }
    return res.status(StatusCodes.OK).json({ dataset });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching dataset", error });
  }
};

// import { Request, Response } from "express";
// import { Dataset } from "@/models/dataset";
// import { StatusCodes } from "http-status-codes";

// export const getDatasetById = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const dataset = await Dataset.findByPk(id);

//     if (!dataset) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: "Dataset not found" });
//     }

//     return res.status(StatusCodes.OK).json({ dataset });
//   } catch (error) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching dataset", error });
//   }
// };
