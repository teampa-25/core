import { InferCreationAttributes } from "sequelize";
import { IDAO } from "@/dao/interfaces/idao";
import { Video } from "@/models/video";
import { ErrorEnum, getError } from "@/utils/api.error";

export class VideoDAO implements IDAO<Video> {
  async get(id: string): Promise<Video | null> {
    try {
      return await Video.findByPk(id);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async getAll(): Promise<Video[]> {
    try {
      return await Video.findAll();
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async update(id: string, data: Partial<Video>): Promise<Video | null> {
    try {
      const update_video = await this.get(id);

      if (!update_video) {
        return null;
      }

      return await update_video.update(data);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const delete_video = await this.get(id);

      if (!delete_video) {
        return false;
      }

      await delete_video.destroy();
      return true;
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR)?.getErrorObj();
    }
  }

  async create(data: InferCreationAttributes<Video>): Promise<string> {
    try {
      const new_video = await Video.create(data);

      if (!new_video.id) {
        throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
      }

      return new_video.id;
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR)?.getErrorObj();
    }
  }
}

// import { InferCreationAttributes } from "sequelize";
// import { IDAO } from "./interfaces/idao"
// import { Video } from "@/models/video";
// import { ErrorEnum, getError } from "@/utils/api-error";

// export class VideoDAO implements IDAO<Video> {

//   async get(id: string): Promise<Video | null> {
//     return Video.findByPk(id);
//   }

//   async getAll(): Promise<Video[]> {
//     return Video.findAll();
//   }

//   async update(id: string, data: Partial<Video>): Promise< Video | null> {
//     const update_video = await this.get(id);

//     if (!update_video) {
//       return null;
//     }

//     return update_video.update(data);
//   }

//   async delete(id: string): Promise<boolean> {
//     const delete_video = await this.get(id);

//     if (!delete_video) {
//       return false;
//     }
//     await delete_video.destroy();
//     return true;
//   }

//   async create(data: InferCreationAttributes<Video>): Promise<string> {
//   const new_video = await Video.create(data);

//   if (!new_video.id){
//       throw getError(ErrorEnum.CREATION_ERROR)?.getErrorObj();
//     }

//     return new_video.id;
//   }
// }
