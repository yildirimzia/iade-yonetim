'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/Loading';
import { isAuthenticated, getAuthData, isAdmin } from '@/lib/auth';
import type { Product } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalSellers: 0,
    pendingReturns: 0,
    readyToShip: 0,
    completedOrders: 0,
  });
  const { user } = getAuthData();
  const userIsAdmin = isAdmin();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const productsData = await productsResponse.json();

      if (productsData.success) {
        setProducts(productsData.data.slice(0, 5)); // Son 5 ürün
      }

      // Fetch statistics from backend
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const statsData = await statsResponse.json();

      if (statsData.success) {
        setStats(statsData.data);
      } else {
        // Hata durumunda varsayılan değerler
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalSellers: 0,
          pendingReturns: 0,
          readyToShip: 0,
          completedOrders: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Hata durumunda varsayılan değerler
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalSellers: 0,
        pendingReturns: 0,
        readyToShip: 0,
        completedOrders: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Hoş Geldiniz, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          {userIsAdmin
            ? 'Admin paneline hoş geldiniz.'
            : 'İşletmenizin genel durumunu görüntüleyin.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Admin İçin: Toplam Kullanıcılar / Satıcı İçin: Toplam Ürünler */}
        {userIsAdmin ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcılar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers > 0 ? stats.totalUsers : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Toplam kayıtlı kullanıcı</span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Ürünlerim</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts > 0 ? stats.totalProducts : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Eklediğiniz ürün sayısı</span>
            </div>
          </div>
        )}

        {/* Admin İçin: Toplam Satıcılar / Satıcı İçin: Bekleyen İadeler */}
        {userIsAdmin ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Satıcılar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalSellers > 0 ? stats.totalSellers : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Kayıtlı satıcı sayısı</span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bekleyen İadeler</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pendingReturns > 0 ? stats.pendingReturns : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">İşlem bekleyen iade</span>
            </div>
          </div>
        )}

        {/* Admin İçin: Toplam Ürünler / Satıcı İçin: Kargoya Hazır */}
        {userIsAdmin ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Ürünler</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts > 0 ? stats.totalProducts : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Link href="/dashboard/products" className="text-indigo-600 font-medium hover:text-indigo-700">
                Tümünü Gör →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kargoya Hazır</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.readyToShip > 0 ? stats.readyToShip : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Link href="/products/shipping" className="text-indigo-600 font-medium hover:text-indigo-700">
                Kargola →
              </Link>
            </div>
          </div>
        )}

        {/* Admin İçin: Kargoya Hazır / Satıcı İçin: Tamamlanan */}
        {userIsAdmin ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kargoya Hazır</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.readyToShip > 0 ? stats.readyToShip : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Kargo bilgisi girilmiş ürün</span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.completedOrders > 0 ? stats.completedOrders : '-'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Tamamlanan sipariş</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Son Ürünler - 2 column */}
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Son Eklenen Ürünler</h2>
                <Link 
                  href={userIsAdmin ? "/dashboard/products" : "/products"}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Tümünü Gör →
                </Link>
              </div>
            </div>

            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Henüz ürün eklenmemiş.</p>
                  <Link 
                    href="/products/create"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    İlk Ürünü Ekle
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div 
                      key={product.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      onClick={() => router.push(userIsAdmin ? `/dashboard/products/${product.id}` : `/products/${product.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.product_name}</p>
                          <p className="text-xs text-gray-500">{product.sku || 'SKU yok'} • {product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(product.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        {product.shipping_name && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Kargo Hazır
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hızlı İşlemler - 1 column */}
        <div className="col-span-1 space-y-6">
          {/* Hızlı İşlemler */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="space-y-3">
              <Link 
                href={userIsAdmin ? "/dashboard/products" : "/products/create"}
                className="block w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">
                    {userIsAdmin ? 'Tüm Ürünler' : 'Yeni Ürün Ekle'}
                  </span>
                </div>
              </Link>

              <Link 
                href="/products/shipping"
                className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span className="font-medium text-gray-700">Kargolama</span>
                </div>
              </Link>

              {userIsAdmin && (
                <Link 
                  href="/dashboard/users"
                  className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-medium text-gray-700">Müşteriler</span>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Bilgilendirme */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">💡 İpucu</h3>
            <p className="text-sm text-indigo-100">
              Ürünlerinize kargolama bilgisi ekleyerek Bulgaristan deposundan hızlı gönderim yapabilirsiniz.
            </p>
            <Link 
              href="/products/shipping"
              className="mt-4 inline-flex items-center text-sm font-medium text-white hover:text-indigo-100"
            >
              Kargolama Sayfasına Git →
            </Link>
          </div>

          {/* Aylık Özet */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Özet</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Toplam Ürünler</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalProducts > 0 ? stats.totalProducts : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kargoya Hazır</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.readyToShip > 0 ? stats.readyToShip : '-'}
                </span>
              </div>
              {userIsAdmin && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Toplam Kullanıcılar</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.totalUsers > 0 ? stats.totalUsers : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Satıcılar</span>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.totalSellers > 0 ? stats.totalSellers : '-'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
