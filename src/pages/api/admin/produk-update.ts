// pages/api/admin/update-produk.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files, File } from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import Produk from '@/lib/models/produk';
import { connectDB } from '@/lib/mongodb';

export const config = {
  api: { bodyParser: false },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ success: false });
  const adminHeader = req.headers['authorization'];
  if (adminHeader !== process.env.ADMIN_PASSWORD) return res.status(401).json({ success: false });

  await connectDB();

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ success: false, message: 'Form error' });

    const id = fields.id?.toString() || '';
    const nama = fields.nama?.toString() || '';
    const harga = fields.harga?.toString() || '';
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!id || !nama || !harga) {
      return res.status(400).json({ success: false, message: 'Data kurang lengkap' });
    }

    try {
      const produk = await Produk.findById(id);
      if (!produk) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });

      let newImageUrl = produk.imageUrl;
      let newPublicId = produk.public_id;

      if (file && 'filepath' in file) {
        // Hapus gambar lama
        await cloudinary.uploader.destroy(produk.public_id);

        // Upload baru
        const result = await cloudinary.uploader.upload(file.filepath, { folder: 'produk' });
        newImageUrl = result.secure_url;
        newPublicId = result.public_id;

        // Hapus file temp
        fs.unlink(file.filepath, () => {});
      }

      // Update data
      produk.nama = nama;
      produk.harga = harga;
      produk.imageUrl = newImageUrl;
      produk.public_id = newPublicId;
      await produk.save();

      return res.status(200).json({ success: true, data: produk });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Gagal update produk' });
    }
  });
}
