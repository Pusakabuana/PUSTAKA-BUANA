// src/pages/api/artikel/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Artikel from '@/lib/models/artikel.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  try {
    const artikel = await Artikel.findById(id);
    if (!artikel) return res.status(404).json({ message: 'Artikel tidak ditemukan' });

    res.status(200).json({ artikel });
  } catch (err) {
    console.error('GET by ID Error:', err);
    res.status(500).json({ message: 'Gagal memuat detail artikel' });
  }
}
