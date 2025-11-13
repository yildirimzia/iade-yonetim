'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

export default function ShippingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const [shippingData, setShippingData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_country: 'Türkiye',
    shipping_company: '',
    shipping_tracking_code: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        // İlk ürünü otomatik seç
        if (data.data.length > 0) {
          const firstProduct = data.data[0];
          setSelectedProduct(firstProduct);
          
          // Eğer ürünün kargo bilgileri varsa düzenleme modunu kapat
          const hasShippingInfo = firstProduct.shipping_name && firstProduct.shipping_address;
          setIsEditing(!hasShippingInfo);
          
          // Ürünün mevcut kargo bilgilerini doldur
          setShippingData({
            shipping_name: firstProduct.shipping_name || '',
            shipping_phone: firstProduct.shipping_phone || '',
            shipping_address: firstProduct.shipping_address || '',
            shipping_city: firstProduct.shipping_city || '',
            shipping_postal_code: firstProduct.shipping_postal_code || '',
            shipping_country: firstProduct.shipping_country || 'Türkiye',
            shipping_company: firstProduct.shipping_company || '',
            shipping_tracking_code: firstProduct.shipping_tracking_code || '',
          });
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Ürünler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSuccess('');
    setError('');
    
    // Eğer ürünün kargo bilgileri varsa düzenleme modunu kapat
    const hasShippingInfo = product.shipping_name && product.shipping_address;
    setIsEditing(!hasShippingInfo);
    
    // Ürünün mevcut kargo bilgilerini doldur
    setShippingData({
      shipping_name: product.shipping_name || '',
      shipping_phone: product.shipping_phone || '',
      shipping_address: product.shipping_address || '',
      shipping_city: product.shipping_city || '',
      shipping_postal_code: product.shipping_postal_code || '',
      shipping_country: product.shipping_country || 'Türkiye',
      shipping_company: product.shipping_company || '',
      shipping_tracking_code: product.shipping_tracking_code || '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Lütfen bir ürün seçin');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...selectedProduct,
          ...shippingData
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Kargolama bilgileri başarıyla kaydedildi!');
        
        // Seçili ürünü güncelle
        setSelectedProduct(data.data);
        
        // Düzenleme modunu kapat
        setIsEditing(false);

        // Ürün listesini yenile
        fetchProducts();
      } else {
        setError(data.message || 'Kargolama bilgileri kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Kargo kaydetme hatası:', err);
      setError('Kargolama bilgileri kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
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

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kargolama Bilgileri</h1>
        <p className="mt-2 text-gray-600">
          İade deposundan müşteriye gönderilecek ürünün kargo bilgilerini girin
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sol Taraf - Ürün Seçimi */}
        <div className="col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Seçin</h2>
            {products.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Henüz ürün eklenmemiş.</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={`w-full text-left p-3 border rounded-lg transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.product_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {product.sku || 'SKU yok'} • {product.category}
                        </p>
                      </div>
                      {selectedProduct?.id === product.id && (
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Taraf - Kargo Formu */}
        <div className="col-span-2">
          {!selectedProduct ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Ürün Seçilmedi</h3>
              <p className="mt-2 text-sm text-gray-500">
                Sol taraftan kargolama bilgilerini girmek istediğiniz ürünü seçin
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Seçili Ürün Bilgisi */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded flex items-center justify-center overflow-hidden">
                    {selectedProduct.image_url ? (
                      <img 
                        src={selectedProduct.image_url} 
                        alt={selectedProduct.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-900">{selectedProduct.product_name}</h3>
                    <p className="text-xs text-indigo-700">{selectedProduct.sku || 'SKU yok'}</p>
                  </div>
                </div>
              </div>

              {/* Success/Error Messages */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Eğer kargo bilgileri varsa ve düzenleme modunda değilse, bilgileri göster */}
              {!isEditing && selectedProduct.shipping_name && selectedProduct.shipping_address ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Kayıtlı Kargolama Bilgileri</h2>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="font-medium">Düzenle</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Alıcı Adı Soyadı</p>
                        <p className="text-sm text-gray-900 font-medium">{selectedProduct.shipping_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Telefon</p>
                        <p className="text-sm text-gray-900 font-medium">{selectedProduct.shipping_phone || '-'}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Adres</p>
                      <p className="text-sm text-gray-900">{selectedProduct.shipping_address}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Şehir</p>
                        <p className="text-sm text-gray-900 font-medium">{selectedProduct.shipping_city}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Posta Kodu</p>
                        <p className="text-sm text-gray-900 font-medium">{selectedProduct.shipping_postal_code || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Ülke</p>
                        <p className="text-sm text-gray-900 font-medium">{selectedProduct.shipping_country}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Kargo Firması</p>
                      <p className="text-sm text-gray-900 font-medium">{selectedProduct.shipping_company || '-'}</p>
                      <p className="text-xs font-medium text-gray-500 mb-1">Takip Kodu</p>
                      <p className="text-xs text-gray-500">
                        {selectedProduct.shipping_tracking_code
                          ? `Takip Kodu: ${selectedProduct.shipping_tracking_code}`
                          : 'Takip kodu girilmedi'}
                      </p>
                    </div>

                   

                
                  </div>

                  {/* Info Box */}
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-green-700">
                        <p className="font-medium">Kargolama bilgileri kaydedildi</p>
                        <p className="mt-1">
                          Bu ürün Bulgaristan iade deposundan belirtilen adrese gönderilmeye hazır.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Düzenleme modu veya yeni kargo bilgisi girişi - Form göster */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Kargo Formu */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Teslimat Bilgileri</h2>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alıcı Adı Soyadı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipping_name"
                      value={shippingData.shipping_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ahmet Yılmaz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="shipping_phone"
                      value={shippingData.shipping_phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+90 555 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="shipping_address"
                      value={shippingData.shipping_address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Mahalle, Sokak, Bina No, Daire No"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şehir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shipping_city"
                        value={shippingData.shipping_city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="İstanbul"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        name="shipping_postal_code"
                        value={shippingData.shipping_postal_code}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="34000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ülke <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="shipping_country"
                      value={shippingData.shipping_country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Türkiye">Türkiye</option>
                      <option value="Almanya">Almanya</option>
                      <option value="Fransa">Fransa</option>
                      <option value="İngiltere">İngiltere</option>
                      <option value="İtalya">İtalya</option>
                      <option value="Hollanda">Hollanda</option>
                      <option value="Belçika">Belçika</option>
                      <option value="Avusturya">Avusturya</option>
                      <option value="İspanya">İspanya</option>
                      <option value="Amerika">Amerika</option>
                    </select>
                  </div>

                  <div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Kargo Firması <span className="text-red-500">*</span></p>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" name="shipping_company" value={shippingData.shipping_company} onChange={handleInputChange}>
                          <option value="DHL">DHL</option>
                          <option value="UPS">UPS</option>
                          <option value="FedEx">FedEx</option>
                          <option value="Aras Kargo">Aras Kargo</option>
                          <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                        </select>
                      </div>
                     
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Takip Kodu <span className="text-red-500">*</span></p>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Takip Kodu" name="shipping_tracking_code" value={shippingData.shipping_tracking_code} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Ürün Bulgaristan iade deposundan gönderilecek</p>
                    <p className="mt-1">
                      Bu bilgiler kargo firmasına iletilecek ve ürün belirttiğiniz adrese teslim edilecektir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Kaydediliyor...' : 'Kargolama Bilgilerini Kaydet'}
                </button>
              </div>
            </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
