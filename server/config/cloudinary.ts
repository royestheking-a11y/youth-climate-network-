import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'youth_climate',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'webp', 'avif'],
      transformation: [
        { width: 1920, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
      ],
    };
  },
});

export const upload = multer({ storage });
export { cloudinary };
