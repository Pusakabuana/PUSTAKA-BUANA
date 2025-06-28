import { fetchArtikelById } from "@/lib/artikel";

type Params = {
  params: {
    id: string;
  };
};

export default async function ArtikelDetailPage({ params }: Params) {
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
