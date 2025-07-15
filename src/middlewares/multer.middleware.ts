import multer from "multer";

/**
 * Multer configuration for file upload
 */
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/*
import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage(); // O usa diskStorage se vuoi salvare su disco
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB, personalizzabile
  },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(zip|mp4|mov|avi)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Unsupported file type"));
    }
  },
});

export function uploadMiddleware(fieldName: string) {
  const handler = upload.single(fieldName);

  return function (req: Request, res: Response, next: NextFunction) {
    handler(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Errori specifici di multer
        let msg = err.message;
        if (err.code === "LIMIT_FILE_SIZE")
          msg = "File too large. Max 10 MB allowed.";
        return res.status(400).json({ success: false, error: msg });
      } else if (err) {
        // Errori generali
        return res.status(500).json({ success: false, error: "File upload failed" });
      }
      next();
    });
  };
}


*/
