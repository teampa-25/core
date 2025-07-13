import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao"
import { Dataset } from "@/models/dataset";



export class DatasetDAO implements IDAO<Dataset> {

  async get(id: string): Promise<Dataset | null> {
    return Dataset.findByPk(id);
  }

  async getAll(): Promise<Dataset[]> {
    return Dataset.findAll();
  }

  async update(id: string, data: Partial<Dataset>): Promise< Dataset | null> {
    const update_dataset = await this.get(id);

    if (!update_dataset) {
      return null;
    }

    return update_dataset.update(data);
  }

  //with paranoid mode enabled, the delete method will do a soft delete
  async delete(id: string): Promise<boolean> {
    const delete_dataset = await this.get(id);

    if (!delete_dataset) {
      return false;
    }
    await delete_dataset.destroy();
    return true;
  }

  async create(data: InferCreationAttributes<Dataset>): Promise<string> {
  const new_dataset = await Dataset.create(data);
  
  if (!new_dataset.id){
      throw new Error("Dataset creation failed");
    }
    
    return new_dataset.id; 
  }
}
