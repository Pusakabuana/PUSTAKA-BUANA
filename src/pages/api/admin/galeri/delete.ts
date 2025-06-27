import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Galeri from '@/lib/models/galeri';
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

  await connectDB();

  try {
    const { id } = req.body;
    const galeri = await Galeri.findById(id);

    if (!galeri) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    // Hapus dari Cloudinary jika ada public_id
    if (galeri.public_id) {
      await cloudinary.uploader.destroy(galeri.public_id);
    }

    await Galeri.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Gambar berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error deleting galeri:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
}
