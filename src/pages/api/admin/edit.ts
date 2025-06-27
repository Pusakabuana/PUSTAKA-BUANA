import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files, File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { connectDB } from '@/lib/mongodb';
import Artikel from '@/lib/models/artikel.model';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const adminHeader = req.headers['authorization'];
  const expectedPassword = process.env.ADMIN_PASSWORD || 'pustakabuana121';

  if (!adminHeader || adminHeader !== expectedPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const artikelId = req.query.id;
  if (!artikelId || typeof artikelId !== 'string') {
    return res.status(400).json({ success: false, message: 'ID artikel tidak valid' });
  }

  await connectDB();

  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    uploadDir: path.join(process.cwd(), '/public/uploads'),
  });

  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      console.error('❌ Error parsing form:', err);
      return res.status(500).json({ success: false, message: 'Form parsing error' });
    }

    const title = typeof fields.title === 'string' ? fields.title : fields.title?.[0];
    const content = typeof fields.content === 'string' ? fields.content : fields.content?.[0];
    const kategori = typeof fields.kategori === 'string' ? fields.kategori : fields.kategori?.[0] || 'Umum';
    const tagsRaw = typeof fields.tags === 'string' ? fields.tags : fields.tags?.[0] || '';
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi.' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    let imageUrl = undefined;

    if (file) {
      const fileObj = file as File;
      const oldPath = fileObj.filepath;
      const fileName = fileObj.originalFilename || fileObj.newFilename || `edit-${Date.now()}`;
      const newPath = path.join(process.cwd(), '/public/uploads', fileName);

      if (!fs.existsSync(path.dirname(newPath))) {
        fs.mkdirSync(path.dirname(newPath), { recursive: true });
      }

      try {
        fs.renameSync(oldPath, newPath);
        imageUrl = `/uploads/${fileName}`;
      } catch (renameErr) {
        console.error('❌ Error moving file:', renameErr);
        return res.status(500).json({ success: false, message: 'Gagal menyimpan gambar' });
      }
    }

    try {
      const updated = await Artikel.findByIdAndUpdate(
        artikelId,
        {
          title,
          content,
          kategori,
          tags,
          ...(imageUrl && { imageUrl }),
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
      }

      return res.status(200).json({ success: true, message: 'Artikel berhasil diperbarui' });
    } catch (dbErr) {
      console.error('❌ Gagal update DB:', dbErr);
      return res.status(500).json({ success: false, message: 'Gagal menyimpan perubahan' });
    }
  });
}
