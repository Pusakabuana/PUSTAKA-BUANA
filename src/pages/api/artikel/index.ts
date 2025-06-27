// pages/api/artikel/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Artikel from '@/lib/models/artikel.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const search = (req.query.q as string) || '';

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [artikel, total] = await Promise.all([
      Artikel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Artikel.countDocuments(query),
    ]);

    res.status(200).json({ artikel, total });
  } catch (err) {
    console.error('GET Artikel Error:', err);
    res.status(500).json({ message: 'Gagal memuat artikel' });
  }
}
