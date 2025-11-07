'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProducts } from '@/store/slices/productsSlice';
import type { Product, ProductStatus } from '@/types';

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

export default function ProductsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const products = useAppSelector((state: any) => state.products.items as Product[]) || [];
  const loading = useAppSelector((state: any) => state.products.loading as boolean);
  const error = useAppSelector((state: any) => state.products.error as string | null);
  
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'draft'>('all');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 50 }));
  }, [dispatch]);

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

  // Filter products based on tab
  const filteredProducts = products.filter(product => {
    if (filterTab === 'published') return product.category !== 'Taslak';
    if (filterTab === 'draft') return product.category === 'Taslak';
    return true;
  });

  const allCount = products.length;
  const publishedCount = products.filter(p => p.category !== 'Taslak').length;
  const draftCount = products.filter(p => p.category === 'Taslak').length;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
        <Link
          href="/products/create"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Eklemek</span>
        </Link>
      </div>

      {/* Tabs and Sort */}
      <div className="border-b border-gray-200 mb-6 flex items-center justify-between">
        <nav className="flex space-x-8">
          <button
            onClick={() => setFilterTab('all')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              filterTab === 'all'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tüm <span className="ml-2 text-gray-400">{allCount}</span>
          </button>
          <button
            onClick={() => setFilterTab('published')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              filterTab === 'published'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Yayımlandı <span className="ml-2 text-gray-400">{publishedCount}</span>
          </button>
          <button
            onClick={() => setFilterTab('draft')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              filterTab === 'draft'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Taslak <span className="ml-2 text-gray-400">{draftCount}</span>
          </button>
        </nav>
        
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 min-w-[140px] justify-between"
          >
            <span>En yeni</span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isSortDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSortDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setIsSortDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700"
                >
                  En yeni
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-3 mb-6">
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Kategori</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium text-gray-700">SKU</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İsim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stoklama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-right">
                <svg className="w-5 h-5 text-gray-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Henüz ürün eklenmemiş.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Link 
                        href={`/products/${product.id}`}
                        className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        {(product.product_image || product.image_url) ? (
                          <img 
                            src={product.product_image || product.image_url} 
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </Link>
                      <div>
                        <Link 
                          href={`/products/${product.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {product.product_name}
                        </Link>
                        <div className="text-xs text-gray-500">
                          {product.category === 'Taslak' ? 'Taslak' : product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.barcode || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const statusInfo = getStatusInfo(product.status);
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} mr-1.5`}></span>
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}