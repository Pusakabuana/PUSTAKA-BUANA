import { fetchArtikelById } from "@/lib/artikel";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ArtikelPageProps {
  params: {
    id: string;
  };
}

// SEO metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  const artikel = await fetchArtikelById(params.id);
  if (!artikel) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: artikel.title + " | Pustaka Buana",
    description: artikel.content.slice(0, 150),
  };
}

export default async function ArtikelDetailPage({ params }: { params: { id: string } }) {
  const artikel = await fetchArtikelById(params.id);
  if (!artikel) notFound();

  return (
    <main className="px-4 max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl md:text-4xl font-bold text-green-900 mb-4">
        {artikel.title}
      </h1>

      {artikel.imageUrl && (
        <Image
          src={artikel.imageUrl}
          alt={artikel.title}
          width={800}
          height={400}
          className="rounded-lg my-6 max-h-[400px] w-full object-cover"
        />
      )}

      <div
        className="prose max-w-none text-justify"
        dangerouslySetInnerHTML={{ __html: artikel.content }}
      />

      {artikel.kategori && (
        <p className="mt-6 text-sm text-gray-500">
          Kategori: <strong>{artikel.kategori}</strong>
        </p>
      )}
    </main>
  );
}
