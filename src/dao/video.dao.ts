import { InferCreationAttributes } from "sequelize";
import { IDAO } from "./interfaces/idao"
import { Video } from "@/models/video";



export class VideoDAO implements IDAO<Video> {

  async get(id: string): Promise<Video | null> {
    return Video.findByPk(id);
  }

  async getAll(): Promise<Video[]> {
    return Video.findAll();
  }

  async update(id: string, data: Partial<Video>): Promise< Video | null> {
    const update_video = await this.get(id);

    if (!update_video) {
      return null;
    }

    return update_video.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const delete_video = await this.get(id);

    if (!delete_video) {
      return false;
    }
    await delete_video.destroy();
    return true;
  }

  async create(data: InferCreationAttributes<Video>): Promise<string> {
  const new_video = await Video.create(data);
  
  if (!new_video.id){
      throw new Error("Video creation failed");
    }
    
    return new_video.id; 
  }
}
