// pages/api/admin/delete.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Artikel from '@/lib/models/artikel.model';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const adminHeader = req.headers['authorization'];
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!adminHeader || adminHeader !== expectedPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID tidak ditemukan' });
  }

  try {
    await connectDB();

    const artikel = await Artikel.findById(id);
    if (!artikel) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    // ✅ Ekstrak public_id dari imageUrl (jika pakai Cloudinary)
    if (artikel.imageUrl && artikel.imageUrl.includes('res.cloudinary.com')) {
      const parts = artikel.imageUrl.split('/');
      const publicIdWithExtension = parts.slice(-1)[0];
      const publicId = `uploads/${publicIdWithExtension.split('.')[0]}`; // atau sesuaikan folder kamu di Cloudinary

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('❌ Gagal hapus dari Cloudinary:', cloudErr);
      }
    }

    await Artikel.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Artikel dan gambar berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error saat menghapus artikel:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghapus artikel' });
  }
}
