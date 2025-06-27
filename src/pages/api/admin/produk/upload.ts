// pages/api/admin/produk/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files, File } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { connectDB } from '@/lib/mongodb';
import Produk from '@/lib/models/produk';

export const config = {
  api: { bodyParser: false },
};

// ✅ Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const adminHeader = req.headers['authorization'];
  if (!adminHeader || adminHeader !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await connectDB();

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      console.error('❌ Form parsing error:', err);
      return res.status(500).json({ success: false, message: 'Gagal parsing form' });
    }

    const nama = fields.nama?.toString() || '';
    const harga = fields.harga?.toString() || '';
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !(file as File).filepath) {
      return res.status(400).json({ success: false, message: 'File tidak valid' });
    }

    if (!nama || !harga) {
      return res.status(400).json({ success: false, message: 'Nama dan harga wajib diisi' });
    }

    const fileObj = file as File;

    try {
      const result = await cloudinary.uploader.upload(fileObj.filepath, {
        folder: 'produk',
      });

      const saved = await Produk.create({
        nama,
        harga,
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });

      return res.status(200).json({ success: true, message: 'Produk berhasil diupload', data: saved });
    } catch (error) {
      console.error('❌ Upload error:', error);
      return res.status(500).json({ success: false, message: 'Upload ke Cloudinary gagal' });
    } finally {
      // ✅ Hapus file sementara
      fs.unlink(fileObj.filepath, () => {});
    }
  });
}
