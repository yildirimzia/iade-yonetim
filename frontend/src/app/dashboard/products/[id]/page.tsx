'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Product, ProductStatus } from '@/types';
import DOMPurify from 'dompurify';
import { isAdmin } from '@/lib/auth';

// Helper function to get status display info
const getStatusInfo = (status?: ProductStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Beklemede',
        color: 'bg-gray-100 text-gray-800',
        dotColor: 'bg-gray-500'
      };
    case 'ready_to_ship':
      return {
        label: 'Kargoya Hazır',
        color: 'bg-blue-100 text-blue-800',
        dotColor: 'bg-blue-500'
      };
    case 'shipped':
      return {
        label: 'Kargoda',
        color: 'bg-yellow-100 text-yellow-800',
        dotColor: 'bg-yellow-500'
      };
    case 'delivered':
      return {
        label: 'Teslim Edildi',
        color: 'bg-green-100 text-green-800',
        dotColor: 'bg-green-500'
      };
    default:
      return {
        label: 'Beklemede',
        color: 'bg-gray-100 text-gray-800',
        dotColor: 'bg-gray-500'
      };
  }
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const userIsAdmin = isAdmin();

  useEffect(() => {
    fetchProductDetails();
  }, [params.id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Ürün detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (newStatus: ProductStatus) => {
    if (!userIsAdmin) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
        setShowStatusDropdown(false);
      } else {
        alert(data.message || 'Durum güncellenirken hata oluştu.');
      }
    } catch (err) {
      alert('Durum güncellenirken bir hata oluştu.');
    } finally {
      setUpdatingStatus(false);
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

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Ürün bulunamadı.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-2 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Geri</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Detayları</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Düzenle</span>
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Sil</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Temel Bilgiler</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{product.product_name}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{product.category}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{product.sku || '-'}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Barkod</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{product.barcode || '-'}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</label>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {product.original_price ? `${Number(product.original_price).toFixed(2)} ₺` : '-'}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Eklenme Tarihi</label>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(product.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {product.seller_name && (
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Satıcı</label>
                  <p className="mt-1">
                    <Link
                      href={`/dashboard/users/${product.seller_id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {product.seller_name}
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          {(product.shipping_name || product.shipping_address) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Kargolama Bilgileri</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  Kargoya Hazır
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Alıcı Adı</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{product.shipping_name || '-'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{product.shipping_phone || '-'}</p>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Adres</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{product.shipping_address || '-'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Şehir</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{product.shipping_city || '-'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Posta Kodu</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{product.shipping_postal_code || '-'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ülke</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{product.shipping_country || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {product.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notlar</h2>
              <div 
                className="prose prose-sm max-w-none text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.notes) }}
              />
            </div>
          )}
        </div>

        {/* Right Column - Actions & Stats */}
        <div className="col-span-1 space-y-6">
     

          {/* Product Status */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Ürün Durumu</h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-100">Stok Durumu</span>
                <span className="text-sm font-medium">Aktif</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-100">Kargo</span>
                <span className="text-sm font-medium">
                  {product.shipping_name ? 'Hazır' : 'Bekliyor'}
                </span>
              </div>
              {userIsAdmin && (
                <div className="pt-3 border-t border-indigo-400">
                  <p className="text-sm text-indigo-100 mb-2">Durum Güncelle</p>
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      disabled={updatingStatus}
                      className="w-full text-left px-3 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">
                        {getStatusInfo(product.status).label}
                      </span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showStatusDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowStatusDropdown(false)}
                        ></div>
                        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-20 py-1">
                          {(['pending', 'ready_to_ship', 'shipped', 'delivered'] as ProductStatus[]).map((status) => {
                            const statusInfo = getStatusInfo(status);
                            return (
                              <button
                                key={status}
                                onClick={() => updateProductStatus(status)}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                  product.status === status ? 'bg-indigo-50' : ''
                                }`}
                              >
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} mr-1.5`}></span>
                                  {statusInfo.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {!userIsAdmin && (
                <div className="flex items-center justify-between pt-3 border-t border-indigo-400">
                  <span className="text-sm text-indigo-100">Durum</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-20">
                    {getStatusInfo(product.status).label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Zaman Çizelgesi</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Ürün Oluşturuldu</p>
                  <p className="text-xs text-gray-500">
                    {new Date(product.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              {product.shipping_name && product.shipping_updated_at && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kargo Bilgisi Eklendi</p>
                    <p className="text-xs text-gray-500">
                      {new Date(product.shipping_updated_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
              {product.shipping_name && !product.shipping_updated_at && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kargo Bilgisi Eklendi</p>
                    <p className="text-xs text-gray-500">Tarih bilinmiyor</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}