import mongoose, { Schema, Document, models } from 'mongoose';

export interface IArtikel extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  kategori?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ArtikelSchema = new Schema<IArtikel>(
  {
    title: {
      type: String,
      required: [true, 'Judul harus diisi'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Konten harus diisi'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    kategori: {
      type: String,
      default: 'Umum',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Otomatis tambahkan createdAt & updatedAt
  }
);

// Hindari duplikasi model saat hot reload di dev
const Artikel = models.Artikel || mongoose.model<IArtikel>('Artikel', ArtikelSchema);

export default Artikel;
