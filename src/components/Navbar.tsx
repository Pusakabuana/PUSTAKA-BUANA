'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Beranda', path: '/' },
  { name: 'Artikel', path: '/artikel' },
  { name: 'Produk', path: '/produk' },
  { name: 'Galeri', path: '/galeri' },
  { name: 'Tentang', path: '/tentang' },
  { name: 'Kontak', path: '/kontak' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-green-800 text-lg">
          Pustaka Buana
        </Link>
        <ul className="flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`hover:underline ${
                  pathname === item.path ? 'text-green-800 font-semibold' : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
