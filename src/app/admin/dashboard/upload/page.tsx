'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    content: '',
    kategori: '',
    tags: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');

  // 🆕 State untuk upload galeri
  const [galleryImage, setGalleryImage] = useState<File | null>(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminPassword = localStorage.getItem('adminPassword');
    if (isAdmin !== 'true' || !adminPassword) {
      router.push('/admin');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Gambar wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('kategori', form.kategori);
    formData.append('tags', form.tags);

    const adminPassword = localStorage.getItem('adminPassword');
    if (!adminPassword) {
      alert('❌ Akses ditolak. Silakan login ulang.');
      router.push('/admin');
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload-image');
    xhr.setRequestHeader('Authorization', adminPassword);

    setLoading(true);
    setProgress(0);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setLoading(false);
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          alert('✅ Konten berhasil diupload.');
          setForm({ title: '', content: '', kategori: '', tags: '' });
          setFile(null);
          setProgress(0);
        } else {
          alert(`❌ Gagal upload konten: ${res.message}`);
        }
      } catch (err) {
        alert('❌ Respon server tidak valid.');
      }
    };

    xhr.onerror = () => {
      alert('❌ Terjadi kesalahan saat upload.');
      setLoading(false);
    };

    xhr.send(formData);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      alert('File PDF belum dipilih.');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);

    const adminPassword = localStorage.getItem('adminPassword');
    if (!adminPassword) {
      alert('Akses ditolak.');
      router.push('/admin');
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload-pdf');
    xhr.setRequestHeader('Authorization', adminPassword);

    setPdfProgress(0);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setPdfProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          setPdfUrl(res.url);
          alert('✅ PDF berhasil diupload.');
          setPdfFile(null);
          setPdfProgress(0);
        } else {
          alert(`❌ Gagal upload PDF: ${res.message}`);
        }
      } catch (err) {
        alert('❌ Respon upload PDF tidak valid.');
      }
    };

    xhr.onerror = () => {
      alert('❌ Gagal mengupload PDF.');
      setPdfProgress(0);
    };

    xhr.send(formData);
  };

  const handleUploadGaleri = async () => {
    if (!galleryImage) {
      alert('Gambar galeri belum dipilih.');
      return;
    }

    const formData = new FormData();
    formData.append('file', galleryImage);
    formData.append('title', galleryTitle);

    setGalleryLoading(true);
    setGalleryProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/galeri/upload-image');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setGalleryProgress(percent);
      }
    };

    xhr.onload = () => {
      setGalleryLoading(false);
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.url) {
          alert('✅ Gambar galeri berhasil diupload.');
          setGalleryImage(null);
          setGalleryTitle('');
          setGalleryProgress(0);
        } else {
          alert('❌ Gagal upload galeri.');
        }
      } catch (err) {
        alert('❌ Respon upload galeri tidak valid.');
      }
    };

    xhr.onerror = () => {
      setGalleryLoading(false);
      alert('❌ Terjadi kesalahan saat upload galeri.');
    };

    xhr.send(formData);
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Upload Konten</h1>

      {/* FORM UPLOAD ARTIKEL */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Judul Artikel"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="content"
          placeholder="Isi Artikel"
          value={form.content}
          onChange={handleChange}
          rows={5}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="kategori"
          placeholder="Kategori (contoh: Pertanian)"
          value={form.kategori}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tag (pisahkan dengan koma: pupuk,organik,hijau)"
          value={form.tags}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
          required
        />

        {loading && (
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="h-4 bg-green-600 text-xs text-white text-center rounded"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
        >
          {loading ? 'Mengupload...' : 'Upload Konten'}
        </button>
      </form>

      {/* FORM UPLOAD PDF */}
      <hr className="my-6 border-t" />
      <h2 className="text-xl font-semibold text-green-700 mb-4">Upload PDF</h2>

      <form onSubmit={handleUploadPdf} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          className="w-full"
          required
        />

        {pdfProgress > 0 && (
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="h-4 bg-green-600 text-xs text-white text-center rounded"
              style={{ width: `${pdfProgress}%` }}
            >
              {pdfProgress}%
            </div>
          </div>
        )}

        {pdfUrl && (
          <p className="text-green-700 text-sm break-all">
            ✅ PDF berhasil diupload:&nbsp;
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {pdfUrl}
            </a>
          </p>
        )}

        <button
          type="submit"
          disabled={pdfProgress > 0}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
        >
          Upload PDF
        </button>
      </form>

      {/* FORM UPLOAD GALERI */}
      <hr className="my-6 border-t" />
      <h2 className="text-xl font-semibold text-green-700 mb-4">Upload Gambar Galeri</h2>

      <input
        type="text"
        placeholder="Judul Gambar (opsional)"
        value={galleryTitle}
        onChange={(e) => setGalleryTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setGalleryImage(e.target.files?.[0] || null)}
        className="w-full"
      />

      {galleryLoading && (
        <div className="w-full bg-gray-200 rounded h-4 mt-2">
          <div
            className="h-4 bg-green-600 text-xs text-white text-center rounded"
            style={{ width: `${galleryProgress}%` }}
          >
            {galleryProgress}%
          </div>
        </div>
      )}

      <button
        onClick={handleUploadGaleri}
        disabled={galleryLoading}
        className="w-full mt-4 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
      >
        {galleryLoading ? 'Mengupload...' : 'Upload Galeri'}
      </button>
    </main>
  );
}
