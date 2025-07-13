import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao"
import { Result } from "@/models/result";



export class ResultDAO implements IDAO<Result> {

  async get(id: string): Promise<Result | null> {
    return Result.findByPk(id);
  }

  async getAll(): Promise<Result[]> {
    return Result.findAll();
  }

  async update(id: string, data: Partial<Result>): Promise< Result | null> {
    const update_result = await this.get(id);

    if (!update_result) {
      return null;
    }

    return update_result.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const delete_result = await this.get(id);

    if (!delete_result) {
      return false;
    }
    await delete_result.destroy();
    return true;
  }

  async create(data: InferCreationAttributes<Result>): Promise<string> {
  const new_result = await Result.create(data);
  
  if (!new_result.id){
      throw new Error("Result creation failed");
    }
    
    return new_result.id; 
  }
}
