import { InferenceJobService } from "@/services/inference-job.service";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

 export class InferenceJobController{
    private inferenceJobService: InferenceJobService

    constructor(){
        this.inferenceJobService = new InferenceJobService()
    }

    createInference = async (req: Request, res: Response, next: NextFunction) => {
        //user from jwt
        //const userId = req.user!.userId;
        const { datasetId, modelId, parameters } = req.body;

        const jobId = await this.inferenceJobService.enqueueJob(
            "userId",
            datasetId,
            modelId,
            parameters
        );
        res.status(StatusCodes.CREATED).json({ jobId: jobId });
    };
 }