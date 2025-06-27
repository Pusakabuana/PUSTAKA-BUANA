'use client';

import Image from 'next/image';
import Link from 'next/link';

const cards = [
  {
    title: 'Artikel',
    desc: 'Baca artikel seputar pertanian dan kehutanan berkelanjutan.',
    href: '/artikel',
  },
  {
    title: 'Produk',
    desc: 'Temukan produk hasil tani, bibit, dan alat pertanian lokal.',
    href: '/produk',
  },
  {
    title: 'Galeri',
    desc: 'Lihat dokumentasi kegiatan lapangan dan pelatihan.',
    href: '/galeri',
  },
  {
    title: 'Tentang Kami',
    desc: 'Kenali lebih dekat visi & misi Pustaka Buana.',
    href: '/tentang',
  },
  {
    title: 'Kontak',
    desc: 'Hubungi kami untuk kolaborasi dan informasi lainnya.',
    href: '/kontak',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Latar belakang alam Pustaka Buana"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Selamat Datang di Pustaka Buana
          </h1>
          <p className="text-lg max-w-xl mx-auto">
            Pusat informasi dan kolaborasi di bidang pertanian & kehutanan
            berkelanjutan.
          </p>
        </div>
      </section>

      {/* MENU CARDS */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="border p-6 rounded-xl shadow hover:shadow-md transition bg-white hover:bg-green-50"
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              {card.title}
            </h2>
            <p className="text-gray-600">{card.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
