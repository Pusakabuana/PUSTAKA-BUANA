'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    content: '',
    kategori: '',
    tags: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stats, setStats] = useState<{ artikelCount: number; galeriCount: number; pdfCount: number } | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminPassword = localStorage.getItem('adminPassword');
    if (isAdmin !== 'true' || !adminPassword) {
      router.push('/admin');
    } else {
      fetchKonten();
      fetchStats(adminPassword);
    }
  }, [router]);

  const fetchStats = async (adminPassword: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: adminPassword },
      });
      const json = await res.json();
      if (json.success) {
        setStats({
          artikelCount: json.artikelCount,
          galeriCount: json.galeriCount,
          pdfCount: json.pdfCount,
        });
      }
    } catch (err) {
      console.error('Gagal fetch stats:', err);
    }
  };

  const fetchKonten = async () => {
    try {
      const res = await fetch('/api/admin/get');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        console.error('❌ Gagal ambil data:', json.message);
      }
    } catch (error) {
      console.error('Gagal fetch konten:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && !editingId) {
      alert('Gambar wajib dipilih!');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('kategori', form.kategori || 'Umum');
    formData.append('tags', form.tags);

    setIsUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    const url = editingId
      ? `/api/admin/edit?id=${editingId}`
      : '/api/admin/upload-image';

    const adminPassword = localStorage.getItem('adminPassword') || '';
    xhr.open(editingId ? 'PUT' : 'POST', url);
    xhr.setRequestHeader('authorization', adminPassword);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          alert(editingId ? '✅ Artikel berhasil diedit!' : '✅ Artikel berhasil diupload!');
          setForm({ title: '', content: '', kategori: '', tags: '' });
          setFile(null);
          setEditingId(null);
          setProgress(0);
          fetchKonten();
          fetchStats(adminPassword);
        } else {
          alert('❌ Gagal simpan: ' + res.message);
        }
      } catch {
        alert('❌ Respon server tidak valid.');
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      alert('❌ Terjadi kesalahan saat kirim.');
    };

    xhr.send(formData);
  };

  const handleEdit = (item: any) => {
    setForm({
      title: item.title,
      content: item.content,
      kategori: item.kategori || '',
      tags: (item.tags || []).join(', '),
    });
    setEditingId(item._id);
    setFile(null);
  };

  const handleDelete = async (id: string) => {
    const adminPassword = localStorage.getItem('adminPassword') || '';
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      try {
        const res = await fetch('/api/admin/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: adminPassword,
          },
          body: JSON.stringify({ id }),
        });

        const result = await res.json();
        if (result.success) {
          alert('✅ Konten dihapus!');
          fetchKonten();
          fetchStats(adminPassword);
        } else {
          alert('❌ Gagal hapus konten.');
        }
      } catch (err) {
        console.error(err);
        alert('❌ Kesalahan saat menghapus.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminPassword');
    router.push('/admin');
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Dashboard Admin</h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.artikelCount}</div>
            <p className="text-gray-600 text-sm">Artikel</p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.galeriCount}</div>
            <p className="text-gray-600 text-sm">Galeri</p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.pdfCount}</div>
            <p className="text-gray-600 text-sm">PDF</p>
          </div>
        </div>
      )}

      {/* Form Upload/Edit */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-8">
        <input
          name="title"
          placeholder="Judul Artikel"
          className="w-full border px-3 py-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Isi Artikel"
          rows={4}
          className="w-full border px-3 py-2 rounded"
          value={form.content}
          onChange={handleChange}
          required
        />
        <input
          name="kategori"
          placeholder="Kategori (opsional)"
          className="w-full border px-3 py-2 rounded"
          value={form.kategori}
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="Tags (pisahkan dengan koma)"
          className="w-full border px-3 py-2 rounded"
          value={form.tags}
          onChange={handleChange}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {isUploading && (
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
          disabled={isUploading}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
        >
          {editingId
            ? isUploading
              ? 'Menyimpan Perubahan...'
              : 'Simpan Perubahan'
            : isUploading
            ? 'Mengupload...'
            : 'Upload Konten'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ title: '', content: '', kategori: '', tags: '' });
              setFile(null);
              setEditingId(null);
            }}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Batal Edit
          </button>
        )}
      </form>

      {/* Daftar Konten */}
      <h2 className="text-lg font-semibold mb-3">Daftar Artikel</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">Belum ada konten.</p>
      ) : (
        data.map((item) => (
          <div key={item._id} className="border p-4 mb-3 rounded shadow-sm bg-white">
            <h3 className="font-bold text-green-700 text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{item.content}</p>
            <p className="text-sm text-gray-500 italic">Kategori: {item.kategori || 'Umum'}</p>
            {item.tags?.length > 0 && (
              <p className="text-sm text-gray-500">Tags: {item.tags.join(', ')}</p>
            )}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="my-2 rounded object-cover max-h-60 w-full"
              />
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={handleLogout}
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Logout
      </button>
    </main>
  );
}
