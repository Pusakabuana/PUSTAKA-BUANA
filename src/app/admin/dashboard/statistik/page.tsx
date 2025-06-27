'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function StatistikPage() {
  const [data, setData] = useState([
    { name: 'Artikel', total: 0 },
    { name: 'PDF', total: 0 },
    { name: 'Galeri', total: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success) {
          setData([
            { name: 'Artikel', total: json.artikelCount },
            { name: 'PDF', total: json.pdfCount },
            { name: 'Galeri', total: json.galeriCount },
          ]);
        }
      } catch (err) {
        console.error('Gagal mengambil statistik:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Statistik Website</h1>

      {loading ? (
        <p className="text-gray-500">Memuat data statistik...</p>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
}
