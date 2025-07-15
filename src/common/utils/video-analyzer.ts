import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { getError } from "./api-error";
import { ErrorEnum } from "@/common/enums";
import { VideoInfo } from "@/common/types";

const execAsync = promisify(exec);

/**
 * Extracts frame count and other informations from a video file buffer
 */
export class VideoAnalyzer {
  static ffprobe_command: string =
    "ffprobe -v quiet -select_streams v:0 -count_frames -show_entries stream=nb_read_frames,duration,width,height,avg_frame_rate -print_format json";

  /**
   * Extract frame count from video buffer
   * @param videoBuffer - The video file as Buffer
   * @param filename - Original filename for temporary file creation
   * @returns Promise<number> - Number of frames in the video
   */
  static async frameCount(
    videoBuffer: Buffer,
    filename: string,
  ): Promise<number> {
    const videoInfo = await this.analyzeVideo(videoBuffer, filename);
    return videoInfo.frameCount;
  }

  /**
   * Analyze video and extract comprehensive information
   * @param videoBuffer - The video file as Buffer
   * @param filename - Original filename for temporary file creation
   * @returns Promise<VideoInfo> - Complete video information
   */
  static async analyzeVideo(
    videoBuffer: Buffer,
    filename: string,
  ): Promise<VideoInfo> {
    let tempFilePath: string | null = null;

    try {
      // Create temporary file
      tempFilePath = await this.createTempFile(videoBuffer, filename);

      const command = `${this.ffprobe_command} "${tempFilePath}"`;
      /* OUTPUT FOR REFERENCE
       *  {
       *    "programs": [],
       *    "stream_groups": [],
       *    "streams": [{
       *          "width": 640,
       *          "height": 480,
       *          "avg_frame_rate": "10/1",
       *          "duration": "10.000000",
       *          "nb_read_frames": "100"
       *        }]
       *  }
       */

      const { stdout } = await execAsync(command);
      if (!stdout) throw new Error("No ffprobe output");

      const json = JSON.parse(stdout);

      const stream = json.streams?.[0];
      if (!stream) throw new Error("No video stream found");

      const frameCount = parseInt(stream.nb_read_frames) || 0;
      const duration = parseFloat(stream.duration) || 0;
      const width = parseInt(stream.width) || 0;
      const height = parseInt(stream.height) || 0;

      const frameRateStr = stream.avg_frame_rate || "0/1";
      const frameRate = this.parseFrameRate(frameRateStr);

      // dont need this i think, its a redundant calculation, we already have that value from nb_read_frames
      // const finalFrameCount = frameCount > 0 ? frameCount : Math.floor(duration * frameRate);

      return {
        frameCount,
        duration,
        width,
        height,
        frameRate,
      };
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    } finally {
      // Clean up temporary file
      if (tempFilePath) {
        await this.cleanupTempFile(tempFilePath);
      }
    }
  }

  /**
   * Create a temporary file from buffer
   * @param buffer The video file buffer
   * @param originalFilename The original filename of the video
   * @returns The path to the created temporary file
   */
  private static async createTempFile(
    buffer: Buffer,
    originalFilename: string,
  ): Promise<string> {
    const tempDir = os.tmpdir();
    const fileExtension = path.extname(originalFilename);
    const tempFilename = `video_${Date.now()}_${Math.random().toString(36).substring(2, 11)}${fileExtension}`;
    const tempFilePath = path.join(tempDir, tempFilename);

    await fs.promises.writeFile(tempFilePath, buffer);
    return tempFilePath;
  }

  /**
   * Clean up temporary file
   * @param filePath
   */
  private static async cleanupTempFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Parse frame rate string (e.g., "30/1", "29970/1000")
   * @param frameRateStr
   * @returns Parsed frame rate as a number
   * If parsing fails, returns a default value of 30
   */
  private static parseFrameRate(frameRateStr: string): number {
    if (!frameRateStr || frameRateStr === "N/A") {
      return 30; // TODO: checks if correct => default fallback
    }

    const parts = frameRateStr.split("/");
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (denominator !== 0) {
        return numerator / denominator;
      }
    }

    // Try to parse as direct number
    const directRate = parseFloat(frameRateStr);
    return isNaN(directRate) ? 30 : directRate;
  }
}
