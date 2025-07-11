import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../config/logger";
import { DatasetService } from "@/services/dataset";

export class DatasetController {
  private datasetService: DatasetService;

  constructor() {
    this.datasetService = new DatasetService();
  }

  async create(req: Request) {}

  async getByFilters(req: Request) {}

  async updateById(req: Request) {}

  async deleteById(req: Request) {}
}
