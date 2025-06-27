// src/app/produk/page.tsx
'use client';

import { useEffect, useState } from 'react';

type Produk = {
  _id: string;
  nama: string;
  harga: string;
  imageUrl: string;
};

export default function ProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/produk')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduk(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal fetch produk:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Produk Unggulan</h1>

      {loading ? (
        <p className="text-gray-500">Memuat produk...</p>
      ) : produk.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada produk tersedia.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {produk.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={p.imageUrl}
                alt={p.nama}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{p.nama}</h2>
                <p className="text-green-700 font-medium mb-2">{p.harga}</p>
                <span className="text-sm text-gray-400">Produk dari Pustaka Buana</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
