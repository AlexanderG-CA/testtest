"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CRUDhandler from '@/components/AdminPanel/CRUD_Handler';

function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const sections = [
    'Admins',
    'Users',
    'Reviews',
    'Orders',
    'Products',
    'ProductCategories',
    'Variants',
    'Categories',
    'Inventory',
  ] as const;

  const [renderWhat, setRenderWhat] = useState<typeof sections[number]>('Admins');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171010]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 rounded-full animate-spin mx-auto mb-4 border-[#362222] border-t-transparent" />
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171010] via-[#1a1212] to-[#171010] px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-[100rem]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your application data</p>
        </div>

        {/* Section Switcher */}
        <div className="bg-gradient-to-br from-[#362222] to-[#2a1818] shadow-2xl p-6 border border-[#4a2a2a] rounded-2xl mb-8">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <div className="w-1 h-6 bg-[#6a4a4a] rounded-full"></div>
            CRUD Sections
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {sections.map((section) => (
              <button
                key={section}
                className={`cursor-pointer group relative overflow-hidden py-3.5 px-5 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 ${renderWhat === section
                  ? 'bg-gradient-to-br from-[#5a4a4a] to-[#4a3a3a] shadow-lg'
                  : 'bg-[#423F3E]/40 hover:bg-[#423F3E]/70'
                  }`}
                onClick={() => setRenderWhat(section)}
              >
                <span className="relative z-10 text-sm">
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                {renderWhat === section && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gradient-to-br from-[#1f1f1f] to-[#252525] rounded-2xl shadow-2xl p-8 border border-[#3a3a3a]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-[#6a4a4a] to-[#4a3a3a] rounded-full"></div>
              {renderWhat.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <p className="text-gray-400 ml-5">Manage your {renderWhat.toLowerCase()} data</p>
          </div>
          <CRUDhandler section={renderWhat} />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;