import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { getTokenFromHeader } from '@/lib/auth';
import Pdf from '@/lib/models/pdf'; // ✅ path yang benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const token = req.headers.authorization;
  if (!token || !getTokenFromHeader(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    await connectDB();
    const pdfs = await Pdf.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: pdfs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
