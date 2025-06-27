'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchArtikelList, ARTIKEL_PER_PAGE } from '@/lib/artikel';

export default function ArtikelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [artikelList, setArtikelList] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageParam = searchParams?.get('page') || '1';
  const qParam = searchParams?.get('q') || '';
  const categoryParam = searchParams?.get('category') || '';
  const currentPage = parseInt(pageParam, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchArtikelList(currentPage, qParam, categoryParam);
      setArtikelList(data.artikel);
      setTotalPages(Math.ceil(data.total / ARTIKEL_PER_PAGE));
      setLoading(false);
    };

    fetchData();
  }, [currentPage, qParam, categoryParam]);

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Artikel
      </h1>

      {/* Filter Form */}
      <form method="GET" className="mb-6 max-w-2xl mx-auto grid gap-4 md:grid-cols-2">
        {/* Pencarian */}
        <input
          type="text"
          name="q"
          placeholder="Cari artikel..."
          defaultValue={qParam}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        {/* Dropdown Kategori */}
        <select
          name="category"
          defaultValue={categoryParam}
          onChange={(e) => {
            const newCategory = e.target.value;
            const params = new URLSearchParams(window.location.search);


            if (newCategory) {
              params.set('category', newCategory);
            } else {
              params.delete('category');
            }

            params.set('page', '1'); // reset ke halaman 1 jika filter berubah
            router.push(`/artikel?${params.toString()}`);
          }}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Semua Kategori</option>
          <option value="Pertanian">Pertanian</option>
          <option value="Perhutanan">Perhutanan</option>
          <option value="Lingkungan">Lingkungan</option>
        </select>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Memuat artikel...</p>
      ) : artikelList.length === 0 ? (
        <p className="text-gray-500 text-center">Belum ada artikel tersedia.</p>
      ) : (
        <div className="space-y-6">
          {artikelList.map((artikel) => (
            <article
              key={artikel._id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <header>
                <Link href={`/artikel/${artikel._id}`}>
                  <h2 className="text-xl font-semibold text-green-700 hover:underline">
                    {artikel.title}
                  </h2>
                </Link>
              </header>

              {artikel.imageUrl && (
                <Link href={`/artikel/${artikel._id}`}>
                  <img
                    src={artikel.imageUrl}
                    alt={artikel.title}
                    className="my-3 rounded w-full max-h-60 object-cover"
                    loading="lazy"
                  />
                </Link>
              )}

              <p className="text-gray-700">
                {artikel.content.length > 200
                  ? artikel.content.substring(0, 200) + '...'
                  : artikel.content}
              </p>

              <Link
                href={`/artikel/${artikel._id}`}
                className="inline-block mt-2 text-green-600 hover:underline text-sm font-medium"
              >
                Baca Selengkapnya →
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex justify-center items-center gap-2 mt-10 flex-wrap"
          aria-label="Paginasi Artikel"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/artikel?page=${page}${qParam ? `&q=${qParam}` : ''}${
                categoryParam ? `&category=${categoryParam}` : ''
              }`}
              className={`px-4 py-2 rounded-md border text-sm ${
                page === currentPage
                  ? 'bg-green-700 text-white'
                  : 'hover:bg-gray-100'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          ))}
        </nav>
      )}
    </main>
  );
}
