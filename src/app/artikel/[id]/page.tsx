// ✅ Updated app/artikel/[id]/page.tsx
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { fetchArtikelById } from '@/lib/artikel';

// ✅ SEO Metadata Dinamis per Artikel
export async function generateMetadata({ params }: { params: { id: string } }) {
  const artikel = await fetchArtikelById(params.id);
  if (!artikel) {
    return {
      title: 'Artikel Tidak Ditemukan | Pustaka Buana',
    };
  }

  return {
    title: artikel.title + ' | Pustaka Buana',
    description: artikel.content.slice(0, 150),
    openGraph: {
      title: artikel.title,
      description: artikel.content.slice(0, 150),
      images: [
        {
          url: artikel.imageUrl || '/default.jpg',
          width: 800,
          height: 600,
          alt: artikel.title,
        },
      ],
    },
  };
}

export default async function DetailArtikel({ params }: { params: { id: string } }) {
  const artikel = await fetchArtikelById(params.id);
  if (!artikel) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2">{artikel.title}</h1>

      <p className="text-sm text-gray-500 mb-6">
        Diposting pada {format(new Date(artikel.createdAt), 'dd MMMM yyyy', { locale: id })}
      </p>

      {artikel.imageUrl && (
        <img
          src={artikel.imageUrl}
          alt={artikel.title}
          className="w-full rounded-lg mb-6 max-h-[400px] object-cover shadow"
        />
      )}

      <article className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
        {artikel.content}
      </article>
    </main>
  );
}