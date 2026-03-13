import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/*
=====================================================
UPLOAD DIRECTORY CONFIG
=====================================================
*/

const BASE_UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const uploadDirs = {
  images: path.join(BASE_UPLOAD_DIR, "images"),
  documents: path.join(BASE_UPLOAD_DIR, "documents"),
  media: path.join(BASE_UPLOAD_DIR, "media")
};

/*
=====================================================
ENSURE DIRECTORIES EXIST
=====================================================
*/

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/*
=====================================================
GENERATE SECURE FILE NAME
=====================================================
*/

const generateFileName = (file) => {
  const uniqueId = crypto.randomUUID();
  let ext = path.extname(file.originalname).toLowerCase();
  
  // Improvement 2: Sanitize extension (prevent abnormally long extensions)
  if (ext.length > 10) ext = ".bin";
  
  const filename = `${uniqueId}${ext}`;
  
  // Improvement 3: Add upload logging
  console.log(`[UPLOAD] Processing: ${file.originalname} -> ${filename} (${file.mimetype})`);
  
  return filename;
};

/*
=====================================================
STORAGE CONFIGURATION
=====================================================
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let destination = BASE_UPLOAD_DIR;

    if (file.mimetype.startsWith("image/")) {
      destination = uploadDirs.images;
    }

    else if (
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("audio/")
    ) {
      destination = uploadDirs.media;
    }

    else if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      destination = uploadDirs.documents;
    }

    cb(null, destination);
  },

  filename: (req, file, cb) => {
    const filename = generateFileName(file);
    cb(null, filename);
  }
});

/*
=====================================================
FILE VALIDATION
=====================================================
*/

const allowedMimeTypes = {
  images: ["image/jpeg", "image/png", "image/webp", "image/jpg"],

  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],

  media: [
    "video/mp4",
    "video/webm",
    "audio/mpeg",
    "audio/wav",
    "audio/webm"
  ]
};

// Improvement 1: Verify File Extension (Dual-Layer Validation)
const allowedExtensions = {
  images: [".jpg", ".jpeg", ".png", ".webp"],
  documents: [".pdf", ".doc", ".docx"],
  media: [".mp4", ".webm", ".mp3", ".wav"]
};

const fileFilter = (req, file, cb) => {

  const allowed = [
    ...allowedMimeTypes.images,
    ...allowedMimeTypes.documents,
    ...allowedMimeTypes.media
  ];

  const allowedExts = [
    ...allowedExtensions.images,
    ...allowedExtensions.documents,
    ...allowedExtensions.media
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(file.mimetype) || !allowedExts.includes(ext)) {
    return cb(
      new Error(`Unsupported file type or extension: ${file.mimetype} (${ext})`),
      false
    );
  }

  cb(null, true);
};

/*
=====================================================
BASE UPLOAD INSTANCE
=====================================================
*/

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

/*
=====================================================
IMAGE UPLOAD (PROFILE)
=====================================================
*/

export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.images.includes(file.mimetype) || !allowedExtensions.images.includes(ext)) {
      return cb(
        new Error("Only image files (.jpg, .jpeg, .png, .webp) are allowed."),
        false
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

/*
=====================================================
DOCUMENT UPLOAD (RESUME)
=====================================================
*/

export const uploadDocument = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.documents.includes(file.mimetype) || !allowedExtensions.documents.includes(ext)) {
      return cb(
        new Error("Only PDF, DOC, DOCX files are allowed."),
        false
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

/*
=====================================================
MEDIA UPLOAD (INTERVIEW RECORDINGS)
=====================================================
*/

export const uploadMedia = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.media.includes(file.mimetype) || !allowedExtensions.media.includes(ext)) {
      return cb(
        new Error("Only audio/video files are allowed."),
        false
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 100 * 1024 * 1024
  }
});

/*
=====================================================
MULTER ERROR HANDLER
=====================================================
*/

export const handleUploadError = (err, req, res, next) => {

  if (err instanceof multer.MulterError) {

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the allowed limit."
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

/*
=====================================================
EXPORT DEFAULT UPLOAD
=====================================================
*/

export default upload;