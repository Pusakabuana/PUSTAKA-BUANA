'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadGaleriPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleUpload = async () => {
    if (!file) {
      alert('Pilih gambar terlebih dahulu!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    setLoading(true);

    try {
      const res = await fetch('/api/admin/galeri/upload', {
        method: 'POST',
        headers: {
          authorization: localStorage.getItem('adminPassword') || '',
        },
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        alert('✅ Gambar berhasil diupload!');
        setFile(null);
        setTitle('');
      } else {
        alert('❌ Gagal upload: ' + result.message);
      }
    } catch (err) {
      alert('❌ Terjadi error saat upload.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Upload Gambar Galeri</h1>
      <input
        type="text"
        placeholder="Judul gambar (opsional)"
        className="w-full border px-3 py-2 mb-4 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
      >
        {loading ? 'Mengupload...' : 'Upload Gambar'}
      </button>
    </main>
  );
}
