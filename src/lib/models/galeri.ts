// lib/models/galeri.ts
import mongoose from "mongoose";

const GaleriSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String, required: false },
    public_id: { type: String, required: true }, // ➕ Ditambahkan untuk keperluan hapus dari Cloudinary
  },
  { timestamps: true }
);

export default mongoose.models.Galeri || mongoose.model("Galeri", GaleriSchema);
