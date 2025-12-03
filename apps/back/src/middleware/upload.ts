import multer from "multer";
import path from "path";

const uploadDir = "../assets/uploads/logos";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, fileName);
  },
});

export const upload = multer({ storage });
