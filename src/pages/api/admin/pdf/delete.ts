// pages/api/admin/pdf/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import Pdf from '@/lib/models/pdf';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' });
  }

  const adminHeader = req.headers['authorization'];
  if (adminHeader !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await connectDB();

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID PDF tidak ditemukan' });
  }

  try {
    const pdf = await Pdf.findById(id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: 'PDF tidak ditemukan' });
    }

    // Hapus dari Cloudinary
    await cloudinary.uploader.destroy(pdf.public_id, { resource_type: 'raw' });

    // Hapus dari MongoDB
    await Pdf.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'PDF berhasil dihapus' });
  } catch (error) {
    console.error('❌ Gagal hapus PDF:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus PDF' });
  }
}
