'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ✅ Ambil password dari env hanya sekali di awal (agar terbaca saat build)
const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      // ✅ Simpan ke localStorage agar bisa dibaca saat upload konten
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminPassword', password);

      // ✅ Arahkan ke dashboard
      router.push('/admin/dashboard');
    } else {
      setError('Password salah!');
    }
  };

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Login Admin</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Masukkan password admin"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
        >
          Login
        </button>
      </form>
    </main>
  );
}
