import axios from 'axios'; // 👈 Replace node-fetch with axios
import ContactSubmission from "../models/ContactSubmission.js";
import { transporter } from "../utils/mailer.js";
import dotenv from 'dotenv';
import { cloudinary } from "../utils/cloudinary.js";
dotenv.config();

export const submitContactForm = async (req, res) => {
  try {
    const { name, company, email, service, description } = req.body;
    const files = req.files;

    // 1. Save submission to MongoDB
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

    // 2. Download files from Cloudinary: try file.path first, then signed URL fallback
    const attachments = await Promise.all(
      files?.map(async (file) => {
        // Try direct download from file.path
        try {
        
          const response = await axios.get(file.path, {
            responseType: 'arraybuffer',
          });
          return {
            filename: file.originalname,
            content: Buffer.from(response.data, 'binary'),
          };
        } catch (err1) {
        
          // Fallback: try signed URL using file.filename as public_id
          try {
            // Use only file.filename (already includes folder) as public_id
            const publicId = file.filename.split(".")[0];
            const format = file.originalname.split(".").pop();
            const signedUrl = cloudinary.url(publicId, {
              resource_type: "raw",
              type: "upload",
              format,
              sign_url: true,
              expires_at: Math.floor(Date.now() / 1000) + 600,
            });
          
            const response = await axios.get(signedUrl, {
              responseType: 'arraybuffer',
            });
            return {
              filename: file.originalname,
              content: Buffer.from(response.data, 'binary'),
            };
          } catch (err2) {
           
            return null;
          }
        }
      }) || []
    );

    // 3. Filter out failed downloads
    const validAttachments = attachments.filter(Boolean);

    // 4. Send email
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
      attachments: validAttachments,
    });

    res.json({ success: true, message: "Form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};