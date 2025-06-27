// app/admin/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.replace('/admin');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {children}
    </div>
  );
}
