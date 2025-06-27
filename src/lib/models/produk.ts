// lib/models/produk.ts
import mongoose from 'mongoose';

const ProdukSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    harga: { type: String, required: true },
    imageUrl: { type: String, required: true },     // URL gambar dari Cloudinary
    public_id: { type: String, required: true },     // ID gambar di Cloudinary (untuk hapus)
  },
  { timestamps: true }
);

// Hindari error model sudah ada di mongoose
export default mongoose.models.Produk || mongoose.model('Produk', ProdukSchema);
