import multer from "multer";
import * as path from "path";

const tempDir = path.join(process.cwd(), "/tmp");

const uploadConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: uploadConfig,
});

export default upload;
