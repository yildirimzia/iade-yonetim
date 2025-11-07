'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User, Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUserById } from '@/store/slices/usersSlice';
import { createProduct } from '@/store/slices/productsSlice';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const selectedUser = useAppSelector((state: any) => state.users.selectedUser as User | null);
  const loading = useAppSelector((state: any) => state.users.loading as boolean);
  const error = useAppSelector((state: any) => state.users.error as string | null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'products' | 'orders'>('details');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    sku: '',
    barcode: '',
    category: '',
    custom_category: '',
    description: '',
    quantity: '',
    height: '',
    width: '',
    length: '',
    weight: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchUserById(params.id));
    fetchUserProducts();
  }, [dispatch, params.id]);

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
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (max 900KB)
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const result = await dispatch(createProduct({
        product_name: newProduct.product_name,
        sku: newProduct.sku,
        barcode: newProduct.barcode,
        category: newProduct.category === 'Diğer' ? newProduct.custom_category : newProduct.category,
        notes: newProduct.description,
        seller_id: parseInt(params.id),
        image_url: uploadedImage || undefined,
      }));

      if (createProduct.fulfilled.match(result)) {
        setShowAddProductModal(false);
        fetchUserProducts();
        setNewProduct({
          product_name: '',
          sku: '',
          barcode: '',
          category: '',
          custom_category: '',
          description: '',
          quantity: '',
          height: '',
          width: '',
          length: '',
          weight: ''
        });
        setUploadedImage(null);
      }
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setAdding(false);
    }
  };

  const user = selectedUser;

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
            <button 
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Ürün Ekle</span>
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

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Ürün Ekle</h2>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="p-6">
              <div className="space-y-6">
                {/* Temel Bilgiler */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Temel bilgiler</h3>
                  <div className="space-y-4">
                    {/* Ürün Adı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ürün adı <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.product_name}
                        onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Erbology Aloe Vera"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Hallet */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hallet
                        </label>
                        <input
                          type="text"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="healthcare-erbology"
                        />
                      </div>

                      {/* Kategori */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        
                        {newProduct.category === 'Diğer' && (
                          <div className="mt-3">
                            <input
                              type="text"
                              value={newProduct.custom_category}
                              onChange={(e) => setNewProduct({ ...newProduct, custom_category: e.target.value })}
                              placeholder="Kategori adını yazın"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tanım */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanım
                      </label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ürün açıklaması..."
                      />
                    </div>
                  </div>
                </div>

                {/* Görüntüler */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Görüntüler</h3>
                  <div className="space-y-4">
                    {uploadedImage && (
                      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img src={uploadedImage} alt="Upload" className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">ürün-resmi.png</p>
                          <p className="text-xs text-gray-500">{(uploadedImage.length / 1024).toFixed(0)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedImage(null)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
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
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Stok ve envanter</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SKU */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stok tutma birimi (SKU)
                        </label>
                        <input
                          type="text"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="401_1BBXBK"
                        />
                        <p className="mt-1 text-xs text-gray-500">Otomatik olarak oluşturulması için boş bırakın</p>
                      </div>

                      {/* Barkod */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Barkod (EAN)
                        </label>
                        <input
                          type="text"
                          value={newProduct.barcode}
                          onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="örneğin 00123456789012"
                        />
                      </div>
                    </div>

                    {/* Miktar */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Miktar
                      </label>
                      <input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="10"
                      />
                    </div>

                    {/* Boyutlar */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yükseklik
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={newProduct.height}
                            onChange={(e) => setNewProduct({ ...newProduct, height: e.target.value })}
                            className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="25"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-gray-500">santimetre</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Genişlik
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={newProduct.width}
                            onChange={(e) => setNewProduct({ ...newProduct, width: e.target.value })}
                            className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="15"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-gray-500">santimetre</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Uzunluk
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={newProduct.length}
                            onChange={(e) => setNewProduct({ ...newProduct, length: e.target.value })}
                            className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="10"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-gray-500">santimetre</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ağırlık
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={newProduct.weight}
                            onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                            className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="2.5"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-gray-500">kilogram</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {adding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Ekleniyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Ürün Ekle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}