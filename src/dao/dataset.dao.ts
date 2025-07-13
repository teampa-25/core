import { Dataset } from "@/models/dataset";
import { IDAO } from "./idao";
import { ErrorEnum, getError } from "@/utils/api-error";
import { Op } from "sequelize";

export class DatasetDAO implements IDAO<Dataset>{
    
    async create(t: Dataset): Promise<string> {
        try{
            const createdDataset = await Dataset.create(t);
            return createdDataset.id;
        }catch(error){
            throw(getError(ErrorEnum.GENERIC_ERROR))?.getErrorObj()
        }
    }

    async filterByTags(tags: string[]): Promise<Dataset[]>{
        try{
            const datasets = await Dataset.findAll({
                where: {
                    tags: {
                        [Op.overlap]: tags,
                    },
                },
            });
            return datasets;
        }catch(error){
            throw(getError(ErrorEnum.NOT_FOUND_ERROR))?.getErrorObj()
        }
    }

    async get(id: string): Promise<Dataset | null> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<Dataset[]> {
        throw new Error("Method not implemented.");
    }

    async update(t: Dataset, ...params: any): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async delete(t: Dataset): Promise<boolean> {
       try {
        const id = t.id

        const [updatedRowsCount] = await Dataset.update(
            { deleted_at: new Date() },
            { where: { id } }
        );

        return updatedRowsCount > 0;

        } catch (error) {
            throw(getError(ErrorEnum.NOT_FOUND_ERROR))?.getErrorObj()
        }
    }
    
}