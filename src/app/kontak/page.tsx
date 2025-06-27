'use client'

import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function KontakPage() {
  const [form, setForm] = useState({ nama: '', email: '', pesan: '' })
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Jalankan reCAPTCHA dan dapatkan token
      const token = await recaptchaRef.current?.executeAsync()
      recaptchaRef.current?.reset()

      if (!token) {
        alert('Verifikasi CAPTCHA gagal atau tidak dijalankan.')
        console.error('Token reCAPTCHA tidak tersedia (null)')
        setLoading(false)
        return
      }

      // Kirim data form dan token ke API
      const res = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      })

      const data = await res.json()

      if (data.success) {
        alert('Pesan berhasil dikirim.')
        setForm({ nama: '', email: '', pesan: '' })
      } else {
        alert('Gagal mengirim pesan: ' + data.message)
      }

    } catch (err) {
      console.error('❌ Terjadi error saat mengirim:', err)
      alert('Terjadi kesalahan saat mengirim pesan.')
    }

    setLoading(false)
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Hubungi Kami</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <textarea
          name="pesan"
          placeholder="Pesan"
          rows={5}
          value={form.pesan}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          size="invisible"
        />
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim'}
        </button>
      </form>
    </main>
  )
}
