// lib/artikel.ts
import { getBaseUrl } from "./getBaseUrl";

export const ARTIKEL_PER_PAGE = 5;

// Fetch list artikel (untuk halaman utama & pagination & search & kategori)
export async function fetchArtikelList(
  page: number,
  query?: string,
  category?: string
) {
  const search = query ? `&q=${encodeURIComponent(query)}` : '';
  const categoryFilter = category ? `&category=${encodeURIComponent(category)}` : '';

  const res = await fetch(
    `${getBaseUrl()}/api/artikel?page=${page}&limit=${ARTIKEL_PER_PAGE}${search}${categoryFilter}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil data artikel");
  }

  return res.json(); // { artikel, total }
}

// Fetch detail artikel by ID (untuk halaman detail /artikel/[id])
export async function fetchArtikelById(id: string) {
  const res = await fetch(`${getBaseUrl()}/api/artikel/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}
