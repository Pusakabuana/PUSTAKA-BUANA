import { notFound } from 'next/navigation';
import { fetchArtikelById } from '@/lib/artikel';
import Image from 'next/image';

interface ArtikelPageProps {
  params: {
    id: string;
  };
}

export default async function ArtikelDetailPage({ params }: ArtikelPageProps) {
  const artikel = await fetchArtikelById(params.id);

  if (!artikel) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {artikel.title}
      </h1>

      {artikel.imageUrl && (
        <div className="relative w-full h-64 mb-6 rounded overflow-hidden">
          <Image
            src={artikel.imageUrl}
            alt={artikel.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <article className="prose prose-green max-w-none">
        <div dangerouslySetInnerHTML={{ __html: artikel.content }} />
      </article>

      {artikel.kategori && (
        <p className="mt-6 text-sm text-gray-500">
          Kategori: <strong>{artikel.kategori}</strong>
        </p>
      )}
    </main>
  );
}
