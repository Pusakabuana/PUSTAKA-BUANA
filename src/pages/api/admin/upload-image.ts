// src/pages/api/admin/upload-image.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File, Fields, Files } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { connectDB } from '@/lib/mongodb';
import Artikel from '@/lib/models/artikel.model';

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const adminHeader = req.headers['authorization'];
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!adminHeader || adminHeader !== expectedPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await connectDB();

  const form = new IncomingForm({ multiples: false, keepExtensions: true });

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error('❌ Error parsing form:', err);
      return res.status(500).json({ success: false, message: 'Form parsing error' });
    }

    const title = typeof fields.title === 'string' ? fields.title : fields.title?.[0];
    const content = typeof fields.content === 'string' ? fields.content : fields.content?.[0];
    const kategori = typeof fields.kategori === 'string' ? fields.kategori : fields.kategori?.[0] || '';
    const tagsRaw = typeof fields.tags === 'string' ? fields.tags : fields.tags?.[0] || '';
    const tags = tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!title || !content || !file) {
      return res.status(400).json({ success: false, message: 'Judul, konten, dan gambar wajib diisi.' });
    }

    const fileObj = file as File;

    try {
      // ✅ Upload ke Cloudinary
      const result = await cloudinary.uploader.upload(fileObj.filepath, {
        folder: 'artikel',
      });

      // ✅ Simpan data ke MongoDB
      const artikel = new Artikel({
        title,
        content,
        kategori,
        tags,
        imageUrl: result.secure_url, // ✅ Pakai URL dari Cloudinary
        public_id: result.public_id, // Optional, kalau kamu ingin bisa hapus dari cloudinary
      });

      await artikel.save();

      return res.status(200).json({ success: true, message: 'Konten berhasil diupload' });
    } catch (uploadErr) {
      console.error('❌ Upload error:', uploadErr);
      return res.status(500).json({ success: false, message: 'Gagal upload ke Cloudinary' });
    } finally {
      fs.unlink(fileObj.filepath, () => {}); // hapus file sementara
    }
  });
}
