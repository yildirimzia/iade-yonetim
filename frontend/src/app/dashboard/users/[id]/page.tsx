'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User, Product } from '@/types';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'products' | 'orders'>('details');

  useEffect(() => {
    fetchUserDetails();
    fetchUserProducts();
  }, [params.id]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Ürünler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!user) return <div className="p-4">Kullanıcı bulunamadı.</div>;

  const totalOrderAmount = products.reduce((sum, product) => sum + Number(product.original_price || 0), 0);

  return (
    <div className="h-full">
      {/* Back Button & Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Müşteriler</span>
        </button>
      </div>

      {/* User Profile Header */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {user.role === 'admin' ? 'Yönetici' : 'Satıcı'}
                  </span>
                  <span className="flex items-center text-emerald-600 text-sm">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mr-1.5"></span>
                    Aktif
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{user.email}</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Aksiyon</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-1 space-y-6">
          {/* Basic Details Card */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Temel detaylar</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Müşteri Kimliği</p>
                <p className="text-sm text-gray-900 font-medium">USR-{String(user.id).padStart(3, '0')}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">İsim</p>
                <p className="text-sm text-gray-900 font-medium">{user.name}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">E-posta</p>
                <p className="text-sm text-gray-900 font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Telefon</p>
                <p className="text-sm text-gray-900 font-medium">{user.phone || '-'}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Şirket</p>
                <p className="text-sm text-gray-900 font-medium">{user.company || '-'}</p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column - Orders/Products */}
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg">
            {/* Products Table */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Ürünler</h2>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Bu kullanıcının henüz ürünü bulunmuyor.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Ürün Adı</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">SKU</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Kategori</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Fiyat</th>
                        <th className="pb-3 text-left text-xs font-medium text-gray-500">Tarih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr 
                          key={product.id}
                          onClick={() => router.push(`/dashboard/products/${product.id}`)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                {product.image_url ? (
                                  <img 
                                    src={product.image_url} 
                                    alt={product.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                                  {product.product_name}
                                </p>
                                {product.barcode && (
                                  <p className="text-xs text-gray-500">{product.barcode}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {product.sku || '-'}
                          </td>
                          <td className="py-4">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-900 font-medium">
                            {product.original_price ? `${Number(product.original_price).toFixed(2)} ₺` : '-'}
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {new Date(product.created_at).toLocaleDateString('tr-TR', { 
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}