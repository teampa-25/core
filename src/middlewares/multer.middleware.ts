import multer from "multer";

/**
 * Multer configuration for file upload
 */
const storage = multer.memoryStorage();
export const upload = multer({ storage });
