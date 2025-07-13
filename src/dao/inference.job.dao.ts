import { InferCreationAttributes } from "sequelize";
import { IDAO } from "@/dao/interfaces/idao";
import { InferenceJob } from "@/models/inference.job";

export class InferenceJobDAO implements IDAO<InferenceJob> {
  async get(id: string): Promise<InferenceJob | null> {
    return InferenceJob.findByPk(id);
  }

  async getAll(): Promise<InferenceJob[]> {
    return InferenceJob.findAll();
  }

  async update(
    id: string,
    data: Partial<InferenceJob>,
  ): Promise<InferenceJob | null> {
    const update_inference_job = await this.get(id);

    if (!update_inference_job) {
      return null;
    }

    return update_inference_job.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const delete_inference_job = await this.get(id);

    if (!delete_inference_job) {
      return false;
    }
    await delete_inference_job.destroy();
    return true;
  }

  async create(data: InferCreationAttributes<InferenceJob>): Promise<string> {
    const new_inference_job = await InferenceJob.create(data);

    if (!new_inference_job.id) {
      throw new Error("Inference Job creation failed");
    }

    return new_inference_job.id;
  }
}
