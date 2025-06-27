import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Artikel from '@/lib/models/artikel.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const artikel = await Artikel.find().sort({ createdAt: -1 }).lean();
    const total = await Artikel.countDocuments();

    return res.status(200).json({
      success: true,
      data: artikel,
      total,
    });
  } catch (error) {
    console.error('❌ Gagal mengambil data:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data.',
    });
  }
}
