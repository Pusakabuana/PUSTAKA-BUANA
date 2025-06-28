import { fetchArtikelById, fetchArtikelList } from "@/lib/artikel";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const artikelList = await fetchArtikelList(1, 100); // ambil banyak untuk pre-render
  return artikelList.map((artikel) => ({
    id: artikel._id,
  }));
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const artikel = await fetchArtikelById(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{artikel?.judul}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: artikel?.isi || "" }}
      />
    </main>
  );
}
