import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema({
  name: String,
  company: String,
  email: String,
  service: String,
  description: String,

  files: [
    {
      originalname: String,
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ContactSubmission", contactSubmissionSchema);
