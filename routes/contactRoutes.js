// routes/contactRoutes.js
import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js"; // NEW
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

const upload = multer({ storage }); // Use Cloudinary storage now

router.post("/", upload.array("files"), submitContactForm);

export default router;
