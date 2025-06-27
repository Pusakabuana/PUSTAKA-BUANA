// pages/api/admin/produk/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Produk from '@/lib/models/produk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const adminHeader = req.headers['authorization'];
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!adminHeader || adminHeader !== expectedPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    await connectDB();
    const produk = await Produk.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      produk,
    });
  } catch (err) {
    console.error('❌ Gagal fetch produk:', err);
    return res.status(500).json({ success: false, message: 'Gagal fetch produk' });
  }
}
