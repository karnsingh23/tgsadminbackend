import express from "express";
import {
  loginAdmin,
  registerAdmin,
  getAllSubmissions,
} from "../controllers/adminController.js";
import { requireAdminAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/submissions", requireAdminAuth, getAllSubmissions);

export default router;
