import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metode tidak diizinkan' })
  }

  const { nama, email, pesan, token } = req.body

  if (!nama || !email || !pesan || !token) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap.' })
  }

  // ✅ Verifikasi reCAPTCHA ke Google
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify`
  const secret = process.env.RECAPTCHA_SECRET_KEY!

  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)

  try {
    const captchaRes = await fetch(verifyURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    const captchaData = await captchaRes.json()

    if (!captchaData.success || (captchaData.score !== undefined && captchaData.score < 0.5)) {
      return res.status(400).json({ success: false, message: 'Verifikasi reCAPTCHA gagal.' })
    }

    // ✅ Kirim Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${nama}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: email, // ✅ Supaya bisa dibalas langsung
      subject: `Pesan dari ${nama} (Pustaka Buana)`,
      html: `
        <p><strong>Nama:</strong> ${nama}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pesan:</strong></p>
        <p>${pesan.replace(/\n/g, '<br>')}</p>
      `,
    })

    return res.status(200).json({ success: true, message: 'Pesan berhasil dikirim.' })
  } catch (err) {
    console.error('❌ Gagal kirim email:', err)
    return res.status(500).json({ success: false, message: 'Gagal mengirim email.' })
  }
}
