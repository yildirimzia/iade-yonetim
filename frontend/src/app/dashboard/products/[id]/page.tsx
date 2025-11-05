'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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

  if (loading) return <div className="p-4">Yükleniyor...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Ürün bulunamadı.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Ürün Detayları</h1>
            <button
              onClick={() => router.back()}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
            >
              ← Geri
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-gray-500 text-sm">Ürün Adı</h2>
              <p className="text-lg font-medium">{product.product_name}</p>
            </div>

            <div>
              <h2 className="text-gray-500 text-sm">Kategori</h2>
              <p className="text-lg font-medium">{product.category}</p>
            </div>

            <div>
              <h2 className="text-gray-500 text-sm">SKU</h2>
              <p className="text-lg font-medium">{product.sku || '-'}</p>
            </div>

            <div>
              <h2 className="text-gray-500 text-sm">Barkod</h2>
              <p className="text-lg font-medium">{product.barcode || '-'}</p>
            </div>

            <div>
              <h2 className="text-gray-500 text-sm">Fiyat</h2>
              <p className="text-lg font-medium">
                {product.original_price ? `${Number(product.original_price).toFixed(2)} ₺` : '-'}
              </p>
            </div>

            <div>
              <h2 className="text-gray-500 text-sm">Eklenme Tarihi</h2>
              <p className="text-lg font-medium">
                {new Date(product.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>

            {product.seller_name && (
              <div>
                <h2 className="text-gray-500 text-sm">Satıcı</h2>
                <p className="text-lg font-medium">
                  <a
                    href={`/dashboard/users/${product.seller_id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {product.seller_name}
                  </a>
                </p>
              </div>
            )}

            {product.notes && (
              <div className="md:col-span-2">
                <h2 className="text-gray-500 text-sm">Notlar</h2>
                <p className="text-lg font-medium whitespace-pre-wrap">{product.notes}</p>
              </div>
            )}
          </div>

          {/* İleride eklenecek özellikler için alan */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">İşlemler</h2>
            <div className="space-y-4">
              {/* Buraya iade, kargo, envanter gibi işlemler eklenecek */}
              <p className="text-gray-500">Yakında yeni özellikler eklenecek...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}