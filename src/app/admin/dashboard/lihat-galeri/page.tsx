'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GaleriItem {
  _id: string;
  url: string;
  title?: string;
}

export default function LihatGaleriPage() {
  const router = useRouter();
  const [data, setData] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminPassword = localStorage.getItem('adminPassword');
    if (isAdmin !== 'true' || !adminPassword) {
      router.push('/admin');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/galeri');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Gagal mengambil data galeri', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const adminPassword = localStorage.getItem('adminPassword');
    if (!confirm('Yakin ingin menghapus gambar ini?')) return;
    setDeletingId(id);

    try {
      const res = await fetch('/api/admin/galeri/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: adminPassword || '',
        },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (json.success) {
        alert('✅ Gambar berhasil dihapus.');
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(`❌ Gagal hapus: ${json.message}`);
      }
    } catch (err) {
      alert('❌ Terjadi kesalahan saat menghapus.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Lihat & Hapus Galeri</h1>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>Tidak ada gambar dalam galeri.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item._id}
              className="relative border rounded-xl overflow-hidden shadow-sm"
            >
              <img
                src={item.url}
                alt={item.title || 'Gambar galeri'}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-2 text-sm">
                {item.title || 'Tanpa judul'}
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={deletingId === item._id}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700 transition"
              >
                {deletingId === item._id ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
