import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname); 
    cb(null, uniqueName + ext);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("files"), submitContactForm);

export default router;
