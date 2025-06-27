// src/pages/api/admin/galeri/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File, Files, Fields } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { connectDB } from '@/lib/mongodb';
import Galeri from '@/lib/models/galeri';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  const adminHeader = req.headers['authorization'];
  if (!adminHeader || adminHeader !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await connectDB();

  const form = new IncomingForm({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ success: false, message: 'Form parsing error' });

    const title = typeof fields.title === 'string' ? fields.title : '';
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) return res.status(400).json({ success: false, message: 'File tidak ditemukan' });

    try {
      const upload = await cloudinary.uploader.upload((file as File).filepath, {
        folder: 'galeri',
      });

      const saved = await Galeri.create({
        url: upload.secure_url,
        public_id: upload.public_id,
        title,
      });

      return res.status(200).json({ success: true, data: saved });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ success: false, message: 'Gagal upload ke Cloudinary' });
    } finally {
      fs.unlink((file as File).filepath, () => {});
    }
  });
}
