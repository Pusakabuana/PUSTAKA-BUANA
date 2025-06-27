// /pages/api/admin/upload-pdf.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
import formidable from 'formidable'
import fs from 'fs'

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' })
  }

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Gagal parsing form:', err)
      return res.status(500).json({ success: false, message: 'Gagal parsing form' })
    }

    const file = files.file?.[0]
    if (!file) {
      return res.status(400).json({ success: false, message: 'File tidak ditemukan' })
    }

    try {
      const upload = await cloudinary.uploader.upload(file.filepath, {
        resource_type: 'raw', // WAJIB untuk PDF
        folder: 'pustakabuana/pdf',
      })

      return res.status(200).json({
        success: true,
        url: upload.secure_url,
        original_filename: upload.original_filename,
      })
    } catch (error) {
      console.error('❌ Upload gagal:', error)
      return res.status(500).json({ success: false, message: 'Upload gagal' })
    }
  })
}
