'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-40">
        <Sidebar />
      </div>
      
      {/* Main Content Area with margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 left-64 z-30">
          <Navbar />
        </div>
        
        {/* Main content with padding for fixed navbar */}
        <main className="flex-1 p-8 overflow-auto mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}