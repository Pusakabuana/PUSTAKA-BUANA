import { notFound } from 'next/navigation';
import { fetchArtikelById } from '@/lib/artikel';

interface ArtikelDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ArtikelDetailPage({ params }: ArtikelDetailPageProps) {
  const artikel = await fetchArtikelById(params.id);

  if (!artikel) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {artikel.title}
      </h1>

      {artikel.kategori && (
        <p className="mt-2 text-sm text-gray-500">
          Kategori: <strong>{artikel.kategori}</strong>
        </p>
      )}

      {artikel.imageUrl && (
        <img
          src={artikel.imageUrl}
          alt={artikel.title}
          className="rounded-lg my-6 max-h-[400px] w-full object-cover"
        />
      )}

      <div
        className="prose max-w-none text-justify"
        dangerouslySetInnerHTML={{ __html: artikel.content }}
      />
    </main>
  );
}
