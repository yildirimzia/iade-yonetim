'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProductById, updateProduct, deleteProduct } from '@/store/slices/productsSlice';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const dispatch = useAppDispatch();
  
  // Redux state
  const selectedProduct = useAppSelector((state: any) => state.products.selectedProduct);
  const loading = useAppSelector((state: any) => state.products.loading as boolean);
  const error = useAppSelector((state: any) => state.products.error as string | null);
  
  const [saving, setSaving] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    product_name: '',
    sku: '',
    barcode: '',
    category: '',
    custom_category: '',
    product_type: 'Fiziksel',
    description: '',
    tags: '',
    price: '',
    currency: 'Amerikan Doları',
    // Stok ve Envanter
    quantity: '',
    // Boyutlar
    height: '',
    width: '',
    length: '',
    weight: '',
  });

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        product_name: selectedProduct.product_name || '',
        sku: selectedProduct.sku || '',
        barcode: selectedProduct.barcode || '',
        category: selectedProduct.category || '',
        custom_category: '',
        product_type: 'Fiziksel',
        description: selectedProduct.notes || '',
        tags: '',
        price: selectedProduct.original_price?.toString() || '',
        currency: 'Amerikan Doları',
        quantity: '10',
        height: '25',
        width: '15',
        length: '5',
        weight: '0.25',
      });
      
      if (selectedProduct.image_url) {
        setUploadedImage(selectedProduct.image_url);
      }
    }
  }, [selectedProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 900 * 1024) {
        alert('Görsel boyutu 900KB\'dan küçük olmalıdır');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await dispatch(updateProduct({
        id: productId,
        data: {
          product_name: formData.product_name,
          sku: formData.sku,
          barcode: formData.barcode,
          category: formData.category === 'Diğer' ? formData.custom_category : formData.category,
          notes: formData.description,
          original_price: parseFloat(formData.price) || 0
        }
      }));

      if (updateProduct.fulfilled.match(result)) {
        router.push('/products');
      }
    } catch (err) {
      console.error('Error updating product:', err);
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
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/products"
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Ürünler
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Ürünü düzenle</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          {/* Sol Taraf - Form Alanları */}
          <div className="col-span-2 space-y-6">
            
            {/* Temel Bilgiler */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel bilgiler</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ürün adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Halletmek
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Sağlık hizmeti">Sağlık hizmeti</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Giyim">Giyim</option>
                      <option value="Ev & Yaşam">Ev & Yaşam</option>
                      <option value="Kozmetik">Kozmetik</option>
                      <option value="Spor">Spor</option>
                      <option value="Oyuncak">Oyuncak</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                    
                    {formData.category === 'Diğer' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          name="custom_category"
                          value={formData.custom_category}
                          onChange={handleInputChange}
                          placeholder="Kategori adını yazın"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip
                  </label>
                  <select
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Fiziksel">Fiziksel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanım
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden quill-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                      className="bg-white h-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Etiketler */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h2>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Natural, Eco-Friendly, Vegan"
              />
              <p className="mt-2 text-xs text-gray-500">Etiketler virgülle ayrılmalıdır</p>
            </div>

            {/* Fiyatlandırma */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fiyatlandırma</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Para birimi
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Amerikan Doları">Amerikan Doları</option>
                    <option value="Euro">Euro</option>
                    <option value="Türk Lirası">Türk Lirası</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="24"
                  />
                </div>
              </div>
            </div>

            {/* Görüntüler */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Görüntüler</h2>
              
              <div className="space-y-4">
                {uploadedImage && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Görüntü</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dosya adı</th>
                          <th className="px-4 py-2 text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-200">
                          <td className="px-4 py-3">
                            <img src={uploadedImage} alt="Product" className="w-12 h-12 object-cover rounded" />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">ürün-1.png</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setUploadedImage(null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Yüklemek için tıklayın veya sürükleyip bırakın
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      (SVG, JPG, PNG veya gif maksimum 900×400)
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Stok ve Envanter */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stok ve envanter</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stok tutma birimi (SKU)
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Otomatik olarak oluşturulması için boş bırakın</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barkod (EAN)
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="örneğin 00123456789012"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miktar
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="backorder"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="backorder" className="text-sm text-gray-700">
                    Geri siparişlere izin ver
                  </label>
                  <button type="button" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yükseklik
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500">santimetre</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genişlik
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500">santimetre</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uzunluk
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500">santimetre</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ağırlık
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500">kilogram</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sağ Taraf - Ürün Kartı ve Butonlar */}
          <div className="space-y-6">
            
            {/* Ürün Kartı */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt={formData.product_name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900">{formData.product_name || 'Ürün Adı'}</h3>
                <p className="text-sm text-gray-500 mt-1">{formData.category || 'Kategori'}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {formData.price ? `${formData.price},00 dolar` : '0,00 dolar'}
                </p>
              </div>
              
              {formData.tags && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Anahtar Kelimeler:</p>
                  <p className="text-sm text-gray-700">{formData.tags}</p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors text-center"
              >
                İptal etmek
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri kaydet'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
