import ContactSubmission from "../models/ContactSubmission.js";
import { transporter } from "../utils/mailer.js";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
export const submitContactForm = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      service,
      description,
      
    } = req.body;
    const files = req.files;

    const newSubmission = await ContactSubmission.create({
      name,
      company,
      email,
      service,
      description,
     
      files: files?.map((f) => ({
        originalname: f.originalname,
        filename: f.filename,
        path: f.path,
        mimetype: f.mimetype,
        size: f.size,
      })) || [],
    });

    await transporter.sendMail({
      from: `Contact Form <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Company: ${company}
        Email: ${email}
        Service: ${service}
        Description: ${description}
      `,
      attachments: files?.map(file => ({
        filename: file.originalname,
        path: file.path
      })) || [],
    });

    res.json({ success: true, message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
