import { fetchArtikelById, fetchArtikelList } from "@/lib/artikel";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const artikelList = await fetchArtikelList(1, 100);
  return artikelList.map((artikel) => ({
    id: artikel._id,
  }));
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const artikel = await fetchArtikelById(params.id);

  if (!artikel) return notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{artikel.judul}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: artikel.isi }}
      />
    </main>
  );
}
