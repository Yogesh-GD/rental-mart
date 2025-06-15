import multer from "multer";
import fs from "fs";
import path from "path";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    if (!file) {
      return cb(null, ""); 
    }
    let uploadDir = "./public/temp/";

    if (req.body.imageType === "vehicleImages" || file.fieldname === "images") {
      uploadDir += "vehicleImages"; 
    } else if (req.body.imageType === "profilePicture" || file.fieldname === "profilePicture") {
      uploadDir += "userProfilePicture"; 
    }  else if (req.body.imageType === "profilePicture" || file.fieldname === "document") {
      uploadDir += "documents"; 
    } else {
      return cb(new Error("Invalid image type. Use 'vehicleImages' or 'profilePicture'."), false);
    }

    ensureDirExists(uploadDir); 
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    if (!file) return cb(null, "");

    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(null, true); 
  }

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
};
