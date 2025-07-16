import * as fs from "fs";
import * as path from "path";
import { getError } from "./api-error";
import { ErrorEnum } from "@/common/enums";

/**
 * Utility class for file system operations
 */
export class FileSystemUtils {
  /**
   * Reads a file from the file system and returns it as a Buffer
   * @param filePath - The absolute path to the file
   * @returns Promise<Buffer> - The file content as a Buffer
   */
  static async readVideoFile(filePath: string): Promise<Buffer> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw getError(ErrorEnum.NOT_FOUND_ERROR);
      }

      // Read file and return as buffer
      return await fs.promises.readFile(filePath);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Reads a ZIP file from the file system and returns it as a Buffer
   * @param filePath - The absolute path to the ZIP file
   * @returns Promise<Buffer> - The ZIP file content as a Buffer
   */
  static async readZipFile(filePath: string): Promise<Buffer> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`ZIP file not found: ${filePath}`);
      }

      // Read file and return as buffer
      return await fs.promises.readFile(filePath);
    } catch (error) {
      console.error(`Error reading ZIP file ${filePath}:`, error);
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Writes a ZIP file to the file system
   * @param filePath - The absolute path where to save the ZIP file
   * @param buffer - The ZIP file content as a Buffer
   * @returns Promise<void>
   */
  static async writeZipFile(filePath: string, buffer: Buffer): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }

      // Write file
      await fs.promises.writeFile(filePath, buffer);
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Checks if a file exists
   * @param filePath - The absolute path to the file
   * @returns boolean - True if file exists, false otherwise
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Gets file stats
   * @param filePath - The absolute path to the file
   * @returns Promise<fs.Stats> - File stats
   */
  static async getFileStats(filePath: string): Promise<fs.Stats> {
    try {
      return await fs.promises.stat(filePath);
    } catch (error) {
      throw getError(ErrorEnum.NOT_FOUND_ERROR);
    }
  }

  /**
   * Deletes a file from the file system
   * @param filePath - The absolute path to the file
   * @returns Promise<void>
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      throw getError(ErrorEnum.GENERIC_ERROR);
    }
  }

  /**
   * Ensures that user directories exist, creating them if they don't
   * @param userId - The user ID to create directories for
   * @returns Promise<boolean> - True if directories were created/exist, false otherwise
   */
  static async ensureUserDirectories(userId: string): Promise<boolean> {
    try {
      const videosDir = `/files/${userId}/videos`;
      const resultsDir = `/files/${userId}/results`;

      await fs.promises.mkdir(videosDir, { recursive: true });
      await fs.promises.mkdir(resultsDir, { recursive: true });

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the video file path for a user
   * @param userId - The user ID
   * @param videoId - The video ID
   * @returns string - The absolute path to the video file
   */
  static getVideoFilePath(userId: string, videoId: string): string {
    return `/files/${userId}/videos/${videoId}.mp4`;
  }

  /**
   * Gets the results directory path for a user
   * @param userId - The user ID
   * @returns string - The absolute path to the results directory
   */
  static getResultsDirectoryPath(userId: string): string {
    return `/files/${userId}/results`;
  }
}
