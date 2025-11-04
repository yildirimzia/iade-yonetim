'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import Loading from '@/components/Loading';
import { isAuthenticated, getAuthData, isAdmin } from '@/lib/auth';
import { productsAPI, returnsAPI, shipmentsAPI, inventoryAPI } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    returns: { total: 0, pending: 0 },
    shipments: { total: 0 },
    inventory: { total_items: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { user } = getAuthData();
  const userIsAdmin = isAdmin();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch products count
      const productsRes = await productsAPI.getAll({ limit: 1 });
      const productsCount = productsRes.pagination?.total || 0;

      // Fetch returns stats
      const returnsRes = await returnsAPI.getStats();
      const returnsStats = returnsRes.data || { total: 0, pending: 0 };

      // Fetch shipments stats
      const shipmentsRes = await shipmentsAPI.getStats();
      const shipmentsStats = shipmentsRes.data || { total: 0 };

      // Fetch inventory stats (admin only)
      let inventoryStats = { total_items: 0 };
      if (userIsAdmin) {
        const inventoryRes = await inventoryAPI.getStats();
        inventoryStats = inventoryRes.data || { total_items: 0 };
      }

      setStats({
        products: productsCount,
        returns: returnsStats,
        shipments: shipmentsStats,
        inventory: inventoryStats,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Hoş Geldiniz, {user?.name}!
              </h1>
              <p className="mt-2 text-gray-600">
                {userIsAdmin
                  ? 'Admin paneline hoş geldiniz.'
                  : 'Satıcı panelinize hoş geldiniz.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {!userIsAdmin && (
                <StatsCard
                  title="Toplam Ürünlerim"
                  value={stats.products}
                  icon="📦"
                  color="blue"
                />
              )}

              <StatsCard
                title="Toplam İadeler"
                value={stats.returns.total || 0}
                icon="↩️"
                color="purple"
              />

              <StatsCard
                title="Bekleyen İadeler"
                value={stats.returns.pending || 0}
                icon="⏳"
                color="yellow"
              />

              <StatsCard
                title="Toplam Kargolar"
                value={stats.shipments.total || 0}
                icon="🚚"
                color="green"
              />

              {userIsAdmin && (
                <StatsCard
                  title="Envanter"
                  value={stats.inventory.total_items || 0}
                  icon="🗃️"
                  color="blue"
                />
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Hızlı İşlemler
                </h2>
                <div className="space-y-3">
                  {!userIsAdmin && (
                    <button
                      onClick={() => router.push('/products')}
                      className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">📦 Ürünlerimi Görüntüle</span>
                    </button>
                  )}
                  <button
                    onClick={() => router.push('/returns')}
                    className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">↩️ İadeleri Görüntüle</span>
                  </button>
                  {userIsAdmin && (
                    <>
                      <button
                        onClick={() => router.push('/inventory')}
                        className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium">🗃️ Envanter Yönetimi</span>
                      </button>
                      <button
                        onClick={() => router.push('/shipments')}
                        className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium">🚚 Kargo Yönetimi</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Son Aktiviteler
                </h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Yakında eklenecek...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
