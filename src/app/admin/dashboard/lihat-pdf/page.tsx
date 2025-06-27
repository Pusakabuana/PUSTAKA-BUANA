'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type PdfItem = {
  _id: string;
  url: string;
  public_id: string;
};

export default function LihatPDFPage() {
  const router = useRouter();
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminPassword = localStorage.getItem('adminPassword');

    if (isAdmin !== 'true' || !adminPassword) {
      router.push('/admin');
      return;
    }

    fetch('/api/admin/get-pdf', {
      headers: { Authorization: adminPassword },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPdfs(data.pdfs);
        } else {
          alert('Gagal memuat daftar PDF');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert('Terjadi kesalahan saat memuat PDF');
        setLoading(false);
      });
  }, [router]);

  const handleDelete = async (id: string) => {
    const adminPassword = localStorage.getItem('adminPassword');
    if (!adminPassword) return;

    if (!confirm('Yakin ingin menghapus PDF ini?')) return;

    try {
      const res = await fetch('/api/admin/pdf/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: adminPassword,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setPdfs((prev) => prev.filter((pdf) => pdf._id !== id));
        alert('✅ PDF berhasil dihapus.');
      } else {
        alert('❌ Gagal menghapus PDF.');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Terjadi kesalahan.');
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Daftar PDF</h1>

      {loading ? (
        <p className="text-gray-600">Memuat data PDF...</p>
      ) : pdfs.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada PDF yang diupload.</p>
      ) : (
        <ul className="space-y-4">
          {pdfs.map((pdf) => (
            <li
              key={pdf._id}
              className="bg-white rounded shadow p-4 flex justify-between items-center"
            >
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {pdf.url}
              </a>
              <button
                onClick={() => handleDelete(pdf._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
