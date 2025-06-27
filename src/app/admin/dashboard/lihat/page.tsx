'use client';

import { useEffect, useState } from 'react';

export default function LihatKontenPage() {
  const [konten, setKonten] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKonten = async () => {
      try {
        const res = await fetch('/api/admin/get');
        const result = await res.json();
        setKonten(result || []);
      } catch (err) {
        console.error('Gagal ambil data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKonten();
  }, []);

  const handleHapus = async (id: string) => {
    const konfirmasi = confirm('Yakin ingin menghapus konten ini?');
    if (!konfirmasi) return;

    try {
      const adminPassword = localStorage.getItem('adminPassword');
      const res = await fetch(`/api/admin/delete?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: adminPassword || '',
        },
      });

      const data = await res.json();
      if (data.success) {
        setKonten(konten.filter((item) => item._id !== id));
        alert('✅ Konten berhasil dihapus.');
      } else {
        alert('❌ Gagal menghapus konten: ' + data.message);
      }
    } catch (err) {
      console.error('Gagal hapus:', err);
      alert('❌ Terjadi kesalahan saat menghapus.');
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Semua Artikel</h1>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : konten.length === 0 ? (
        <p className="text-gray-500">Belum ada artikel yang diupload.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {konten.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-green-700">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.content}</p>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <p className="text-xs text-gray-400 mb-2">
                {new Date(item.createdAt).toLocaleString('id-ID')}
              </p>
              <button
                onClick={() => handleHapus(item._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
