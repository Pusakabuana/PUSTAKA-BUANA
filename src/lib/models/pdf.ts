// lib/models/pdf.ts
import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    original_filename: { type: String, required: true },
    public_id: { type: String, required: true }, // digunakan untuk hapus dari Cloudinary
  },
  { timestamps: true }
);

export default mongoose.models.Pdf || mongoose.model('Pdf', PdfSchema);
