import { fetchArtikelById } from '@/lib/artikel';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Props = {
  params: { id: string };
};

export default async function ArtikelDetailPage({ params }: Props) {
  const artikel = await fetchArtikelById(params.id);

  if (!artikel) {
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        {artikel.title}
      </h1>

      {artikel.imageUrl && (
        <div className="relative w-full h-64 mb-6">
          <Image
            src={artikel.imageUrl}
            alt={artikel.title}
            fill
            className="object-cover rounded"
            priority
          />
        </div>
      )}

      <article className="prose max-w-none prose-green">
        <p>{artikel.content}</p>
      </article>
    </main>
  );
}
