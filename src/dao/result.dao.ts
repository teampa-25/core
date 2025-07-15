import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao";
import { Result } from "@/models";
import { ErrorEnum, getError } from "@/common/utils/api-error";

export class ResultDAO implements IDAO<Result> {
  async get(id: string): Promise<Result | null> {
    try {
      return await Result.findByPk(id);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  /**
   * Retrieves a result by its associated inference job ID
   * @param inferenceJobId - The ID of the inference job
   * @returns A Promise that resolves to the result or null if not found
   */
  async getByInferenceJobId(inferenceJobId: string): Promise<Result | null> {
    try {
      return await Result.findOne({
        where: { inference_job_id: inferenceJobId },
      });
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async getAll(): Promise<Result[]> {
    try {
      return await Result.findAll();
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async update(id: string, data: Partial<Result>): Promise<Result | null> {
    try {
      const update_result = await this.get(id);

      if (!update_result) {
        return null;
      }

      return await update_result.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const delete_result = await this.get(id);

      if (!delete_result) {
        return false;
      }

      await delete_result.destroy();
      return true;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async create(data: InferCreationAttributes<Result>): Promise<string> {
    try {
      const new_result = await Result.create(data);

      if (!new_result.id) {
        throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
      }

      return new_result.id;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }
}

// import { InferCreationAttributes } from "sequelize";
// import { IDAO } from "./interfaces/idao"
// import { Result } from "@/models/result";

// export class ResultDAO implements IDAO<Result> {

//   async get(id: string): Promise<Result | null> {
//     return Result.findByPk(id);
//   }

//   async getAll(): Promise<Result[]> {
//     return Result.findAll();
//   }

//   async update(id: string, data: Partial<Result>): Promise< Result | null> {
//     const update_result = await this.get(id);

//     if (!update_result) {
//       return null;
//     }

//     return update_result.update(data);
//   }

//   async delete(id: string): Promise<boolean> {
//     const delete_result = await this.get(id);

//     if (!delete_result) {
//       return false;
//     }
//     await delete_result.destroy();
//     return true;
//   }

//   async create(data: InferCreationAttributes<Result>): Promise<string> {
//   const new_result = await Result.create(data);

//   if (!new_result.id){
//       throw new Error("Result creation failed");
//     }

//     return new_result.id;
//   }
// }
