import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    
    if (file.fieldname === 'idProof') {
      uploadPath = path.join(uploadsDir, 'id-proofs');
    } else if (file.fieldname === 'image') {
      uploadPath = path.join(uploadsDir, 'complaints');
    } else if (file.fieldname === 'photos') {
      uploadPath = path.join(uploadsDir, 'maintenance');
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();

  const allowedExts = new Set(['.jpeg', '.jpg', '.png', '.pdf', '.webp', '.heic', '.heif']);
  const isAllowedExt = allowedExts.has(ext);

  const isAllowedMime =
    mime.startsWith('image/') ||
    mime === 'application/pdf' ||
    mime.includes('pdf'); // e.g. application/x-pdf on some systems

  if (isAllowedExt || isAllowedMime) {
    return cb(null, true);
  }

  cb(new Error('Only image files (jpg, jpeg, png, webp, heic/heif) and PDF files are allowed'));
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: fileFilter
});

