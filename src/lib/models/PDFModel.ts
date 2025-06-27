import mongoose, { Schema, model, models } from 'mongoose';

const PDFSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hindari duplikasi model saat dev (hot reload)
const PDFModel = models.PDF || model('PDF', PDFSchema);

export default PDFModel;
