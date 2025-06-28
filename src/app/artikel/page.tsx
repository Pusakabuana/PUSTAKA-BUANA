import { fetchArtikelById } from '@/lib/artikel';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const artikel = await fetchArtikelById(params.id);
  if (!artikel) return { title: 'Artikel Tidak Ditemukan' };

  return {
    title: artikel.title + ' | Pustaka Buana',
    description: artikel.content?.slice(0, 150) || '',
  };
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const artikel = await fetchArtikelById(params.id);
  if (!artikel) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{artikel.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {artikel.kategori} | {new Date(artikel.createdAt).toLocaleDateString()}
      </p>

      {artikel.imageUrl && (
        <Image
          src={artikel.imageUrl}
          alt={artikel.title}
          width={800}
          height={400}
          className="rounded-lg my-6 w-full object-cover max-h-[400px]"
        />
      )}

      <div
        className="prose max-w-none text-justify"
        dangerouslySetInnerHTML={{ __html: artikel.content }}
      />
    </div>
  );
}
