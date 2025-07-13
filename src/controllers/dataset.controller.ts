import { Request, Response } from "express";
import { Dataset } from "@/models/dataset";
import { StatusCodes } from "http-status-codes";

export const getDatasetById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const dataset = await Dataset.findByPk(id);

    if (!dataset) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Dataset not found" });
    }

    return res.status(StatusCodes.OK).json({ dataset });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching dataset", error });
  }
};