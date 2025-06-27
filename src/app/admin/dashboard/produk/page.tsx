'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Produk = {
  _id: string;
  nama: string;
  harga: string;
  imageUrl: string;
  public_id: string;
};

export default function AdminProdukPage() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editProdukId, setEditProdukId] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminPassword = localStorage.getItem('adminPassword');
    if (isAdmin !== 'true' || !adminPassword) {
      router.push('/admin');
    } else {
      fetchProduk();
    }
  }, [router]);

  const fetchProduk = async () => {
    const adminPassword = localStorage.getItem('adminPassword');
    const res = await fetch('/api/admin/get-produk', {
      headers: { Authorization: adminPassword || '' },
    });
    const json = await res.json();
    if (json.success) {
      setProdukList(json.data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = localStorage.getItem('adminPassword');
    if (!nama || !harga || (!file && !editMode) || !adminPassword) {
      alert('❌ Lengkapi semua data!');
      return;
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('harga', harga);
    if (file) formData.append('file', file);
    if (editMode) formData.append('id', editProdukId);

    const xhr = new XMLHttpRequest();
    xhr.open(editMode ? 'PUT' : 'POST', editMode ? '/api/admin/update-produk' : '/api/admin/produk/upload');
    xhr.setRequestHeader('authorization', adminPassword);
    setIsUploading(true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200) {
        alert(editMode ? '✅ Produk berhasil diupdate' : '✅ Produk berhasil diupload');
        resetForm();
        fetchProduk();
      } else {
        alert('❌ Gagal menyimpan produk');
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      alert('❌ Upload error');
    };

    xhr.send(formData);
  };

  const resetForm = () => {
    setNama('');
    setHarga('');
    setFile(null);
    setProgress(0);
    setEditMode(false);
    setEditProdukId('');
  };

  const handleDelete = async (id: string) => {
    const adminPassword = localStorage.getItem('adminPassword');
    if (!confirm('Yakin ingin hapus produk ini?')) return;

    const res = await fetch('/api/admin/delete-produk', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: adminPassword || '',
      },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.success) {
      alert('✅ Produk berhasil dihapus');
      fetchProduk();
    } else {
      alert('❌ Gagal hapus produk');
    }
  };

  const startEdit = (produk: Produk) => {
    setEditMode(true);
    setEditProdukId(produk._id);
    setNama(produk.nama);
    setHarga(produk.harga);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">{editMode ? 'Edit Produk' : 'Manajemen Produk'}</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4 mb-8">
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Produk"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          placeholder="Harga (contoh: Rp 25.000)"
          className="w-full border px-3 py-2 rounded"
          required
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
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
          disabled={isUploading}
        >
          {isUploading ? 'Menyimpan...' : editMode ? 'Simpan Perubahan' : 'Upload Produk'}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Batal Edit
          </button>
        )}
      </form>

      <h2 className="text-lg font-semibold mb-3">Daftar Produk</h2>
      {produkList.length === 0 ? (
        <p className="text-gray-500">Belum ada produk diupload.</p>
      ) : (
        <ul className="space-y-4">
          {produkList.map((p) => (
            <li key={p._id} className="bg-white rounded shadow p-4 flex items-center gap-4">
              <img
                src={p.imageUrl}
                alt={p.nama}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-bold text-green-800">{p.nama}</h3>
                <p className="text-green-700">{p.harga}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
