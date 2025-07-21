// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "contact_uploads",
    resource_type: "raw",       // 👈 important for PDF
    type: "upload",             // 👈 must be "upload" (not "private")
    access_mode: "public",      // 👈 ensure public access
    format: async (req, file) => {
      return file.originalname.split('.').pop();
    },
    public_id: (req, file) => {
      const name = file.originalname.split(".")[0];
      const timestamp = Date.now();
      return `${name}_${timestamp}`;
    },
  },
});


export { cloudinary };
