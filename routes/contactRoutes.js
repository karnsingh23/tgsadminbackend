import express from "express";
import multer from "multer";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("files"), submitContactForm);

export default router;
