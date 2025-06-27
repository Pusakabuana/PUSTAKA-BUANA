import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Artikel from '@/lib/models/artikel.model';
import Galeri from '@/lib/models/galeri';
import Pdf from '@/lib/models/pdf'; // pastikan file ini ada

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

    const [artikelCount, galeriCount, pdfCount] = await Promise.all([
      Artikel.countDocuments(),
      Galeri.countDocuments(),
      Pdf?.countDocuments() || 0,
    ]);

    return res.status(200).json({
      success: true,
      artikelCount,
      galeriCount,
      pdfCount,
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}
