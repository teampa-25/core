import { Dataset } from "@/models/dataset";
import { IDAO } from "@dao/interfaces/idao";
import { ErrorEnum, getError } from "@/utils/api-error";
import { Op, InferCreationAttributes } from "sequelize";

export class DatasetDAO implements IDAO<Dataset> {
  async create(data: InferCreationAttributes<Dataset>): Promise<string> {
    try {
      const createdDataset = await Dataset.create(data);
      return createdDataset.id;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async filterByTags(tags: string[]): Promise<Dataset[]> {
    try {
      const datasets = await Dataset.findAll({
        where: {
          tags: {
            [Op.overlap]: tags,
          },
          deleted_at: null,
        },
      });
      return datasets;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async get(id: string): Promise<Dataset | null> {
    try {
      const dataset = await Dataset.findOne({
        where: {
          id,
          deleted_at: null,
        },
      });
      return dataset;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async getAll(): Promise<Dataset[]> {
    try {
      const datasets = await Dataset.findAll({
        where: {
          deleted_at: null,
        },
      });
      return datasets;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async update(id: string, data: Partial<Dataset>): Promise<Dataset | null> {
    try {
      const dataset = await this.get(id);

      if (!dataset) {
        return null;
      }

      return await dataset.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [updatedRowsCount] = await Dataset.update(
        { deleted_at: new Date() },
        {
          where: {
            id,
            deleted_at: null,
          },
        },
      );

      return updatedRowsCount > 0;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }
}

// import { Dataset } from "@/models/dataset";
// import { IDAO } from "@dao/interfaces/idao";
// import { ErrorEnum, getError } from "@/utils/api-error";
// import { Op } from "sequelize";

// export class DatasetDAO implements IDAO<Dataset>{

//     async create(t: Dataset): Promise<string> {
//         try{
//             const createdDataset = await Dataset.create(t);
//             return createdDataset.id;
//         }catch(error){
//             throw(getError(ErrorEnum.GENERIC_ERROR))?.getErrorObj()
//         }
//     }

//     async filterByTags(tags: string[]): Promise<Dataset[]>{
//         try{
//             const datasets = await Dataset.findAll({
//                 where: {
//                     tags: {
//                         [Op.overlap]: tags,
//                     },
//                 },
//             });
//             return datasets;
//         }catch(error){
//             throw(getError(ErrorEnum.NOT_FOUND_ERROR))?.getErrorObj()
//         }
//     }

//     async get(id: string): Promise<Dataset | null> {
//         throw new Error("Method not implemented.");
//     }

//     async getAll(): Promise<Dataset[]> {
//         throw new Error("Method not implemented.");
//     }

//     async update(t: Dataset, ...params: any): Promise<boolean> {
//         throw new Error("Method not implemented.");
//     }

//     async delete(t: Dataset): Promise<boolean> {
//        try {
//         const id = t.id

//         const [updatedRowsCount] = await Dataset.update(
//             { deleted_at: new Date() },
//             { where: { id } }
//         );

//         return updatedRowsCount > 0;

//         } catch (error) {
//             throw(getError(ErrorEnum.NOT_FOUND_ERROR))?.getErrorObj()
//         }
//     }

// }
