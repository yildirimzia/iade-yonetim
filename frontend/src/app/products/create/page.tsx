'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
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
    // Stok ve Envanter
    quantity: '',
    // Boyutlar
    height: '',
    width: '',
    length: '',
    weight: '',
  });

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
      // Dosya boyutu kontrolü (max 900KB ≈ 900x400)
      if (file.size > 900 * 1024) {
        setError('Görsel boyutu 900KB\'dan küçük olmalıdır');
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
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product_name: formData.product_name,
          sku: formData.sku,
          barcode: formData.barcode,
          category: formData.category === 'Diğer' ? formData.custom_category : formData.category,
          notes: formData.description,
          // Şimdilik varsayılan değerler
          original_price: 0
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/products');
      } else {
        setError(data.message || 'Ürün eklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Ürün eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Ürün oluştur</h1>
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
                    placeholder="Erbology Aloe Vera"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hallet
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="healthcare-erbology"
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
                      placeholder="Erbology Aloe Vera is a natural, eco-friendly, and vegan product."
                      className="bg-white h-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Görüntüler */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Görüntüler</h2>
              
              <div className="space-y-4">
                {uploadedImage && (
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img src={uploadedImage} alt="Upload" className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">ürün-1.png</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
                      placeholder="401_1BBXBK"
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
                    placeholder="10"
                  />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="25"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="15"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="5"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="0,25"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-500">kilogram</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Yan Panel */}
          <div className="space-y-6">
            
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : 'Değişiklikleri kaydet'}
              </button>
              <Link
                href="/products"
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors text-center block"
              >
                İptal etmek
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
