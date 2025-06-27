// src/pages/api/admin/get-pdf.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import PDFModel from '@/lib/models/PDFModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' });
  }

  try {
    await connectDB();
    const pdfList = await PDFModel.find().sort({ createdAt: -1 });

    return res.status(200).json(pdfList);
  } catch (error) {
    console.error('❌ Gagal mengambil PDF:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil PDF' });
  }
}
