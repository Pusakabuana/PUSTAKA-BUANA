import { getBaseUrl } from "@/lib/getBaseUrl";

type GaleriItem = {
  _id: string;
  url: string;
  title?: string;
};

export const metadata = {
  title: "Galeri | Pustaka Buana",
  description: "Dokumentasi kegiatan Pustaka Buana dalam bentuk galeri foto.",
};

export default async function GaleriPage() {
  const res = await fetch(`${getBaseUrl()}/api/galeri`, { cache: "no-store" });
  const images: GaleriItem[] = await res.json();

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Galeri Kegiatan</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {images.map((item, i) => (
          <div
            key={item._id}
            className="overflow-hidden rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <img src={item.url} alt={item.title || `Galeri ${i + 1}`} className="w-full h-48 object-cover" />
          </div>
        ))}
      </div>
    </main>
  );
}
