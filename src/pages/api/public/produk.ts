// /pages/api/public/produk.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Produk from '@/lib/models/produk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    const produk = await Produk.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: produk });
  } catch (error) {
    console.error('❌ Gagal fetch produk:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data produk' });
  }
}
