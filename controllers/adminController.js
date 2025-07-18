import Admin from "../models/Admin.js";
import ContactSubmission from "../models/ContactSubmission.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existing = await Admin.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await Admin.create({ username, password: hashed });

    res.json({ success: true, message: "Admin registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
