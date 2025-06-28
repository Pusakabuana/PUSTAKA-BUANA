// src/app/artikel/page.tsx
import { fetchArtikelList, ARTIKEL_PER_PAGE } from "@/lib/artikel";
import Link from "next/link";

export const metadata = {
  title: "Artikel | Pustaka Buana",
  description: "Kumpulan artikel pertanian dan kehutanan dari Pustaka Buana.",
};

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    q?: string;
    category?: string;
  };
}) {
  const page = Number(searchParams?.page || 1);
  const query = searchParams?.q || "";
  const category = searchParams?.category || "";

  const { artikel, total } = await fetchArtikelList(page, query, category);
  const totalPages = Math.ceil(total / ARTIKEL_PER_PAGE);

  return (
    <main className="px-4 max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-green-900 mb-4">Daftar Artikel</h1>

      <form className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="q"
          placeholder="Cari artikel..."
          defaultValue={query}
          className="border px-3 py-2 rounded"
        />
        <select
          name="category"
          defaultValue={category}
          className="border px-3 py-2 rounded"
        >
          <option value="">Semua Kategori</option>
          <option value="Pertanian">Pertanian</option>
          <option value="Perhutanan">Perhutanan</option>
        </select>
        <button
          type="submit"
          className="bg-green-700 text-white rounded px-4 py-2 hover:bg-green-800"
        >
          Filter
        </button>
      </form>

      <ul className="space-y-6">
        {artikel.map((item: any) => (
          <li key={item._id}>
            <Link href={`/artikel/${item._id}`} className="block group">
              <h2 className="text-xl font-semibold group-hover:underline text-green-800">
                {item.title}
              </h2>
              <p className="text-gray-600 line-clamp-2">
                {item.content.slice(0, 120)}...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {item.kategori} · {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-10">
        <span className="text-sm text-gray-500">
          Halaman {page} dari {totalPages}
        </span>

        <div className="space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}&q=${query}&category=${category}`}
              className={`px-3 py-1 border rounded ${
                p === page ? "bg-green-700 text-white" : "text-green-700"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
