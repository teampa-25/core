import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { ErrorEnum, getError } from "./api-error";

const execAsync = promisify(exec);

interface VideoInfo {
  frameCount: number;
  duration: number;
  width: number;
  height: number;
  frameRate: number;
}

/**
 * Extracts frame count and other informations from a video file buffer
 */
export class VideoAnalyzer {
  /**
   * Extract frame count from video buffer
   * @param videoBuffer - The video file as Buffer
   * @param filename - Original filename for temporary file creation
   * @returns Promise<number> - Number of frames in the video
   */
  static async extractFrameCount(
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

      // TODO: checks if this command is correct
      const command = `ffprobe -v quiet -select_streams v:0 -count_frames -show_entries stream=nb_read_frames,duration,width,height,avg_frame_rate -of csv=p=0 "${tempFilePath}"`;

      const { stdout } = await execAsync(command);

      // Parse ffprobe output
      const lines = stdout.trim().split("\n");
      if (lines.length === 0) {
        throw new Error("No video stream found");
      }

      const data = lines[0].split(",");

      if (data.length < 5) {
        throw new Error("Invalid ffprobe output format");
      }

      const frameCount = parseInt(data[0]) || 0;
      const duration = parseFloat(data[1]) || 0;
      const width = parseInt(data[2]) || 0;
      const height = parseInt(data[3]) || 0;

      // Parse frame rate (format: num/den)
      const frameRateStr = data[4];
      const frameRate = this.parseFrameRate(frameRateStr);

      // Validate frame count => if ffprobe couldn't count frames, estimate from duration and frame rate
      const finalFrameCount =
        frameCount > 0 ? frameCount : Math.floor(duration * frameRate);

      return {
        frameCount: finalFrameCount,
        duration,
        width,
        height,
        frameRate,
      };
    } catch (error) {
      throw new Error(
        `Error analyzing video: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
      throw getError(ErrorEnum.CLEANUP_ERROR);
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
