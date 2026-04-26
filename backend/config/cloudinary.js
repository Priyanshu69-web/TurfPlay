import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
  api_key: process.env.CLOUDINARY_URL.split('://')[1].split(':')[0],
  api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0],
});

// Helper for direct URL if you already have the components, 
// but wait, the CLOUDINARY_URL in .env was already complete.
// Let me re-verify the config logic.

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'turfplay',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export const upload = multer({ storage: storage });

export default cloudinary;
