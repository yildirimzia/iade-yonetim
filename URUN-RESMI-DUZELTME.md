# 🖼️ Ürün Resmi Yükleme - Düzeltme Özeti

## 🔍 Sorun
Ürün eklerken resim seçiliyor ama **veritabanına kaydedilmiyordu**.

## ✅ Çözüm

### Backend (Tamamlandı ✓)
Backend zaten tamamen hazırdı:
- ✅ Cloudinary yapılandırması (`/backend/config/cloudinary.js`)
- ✅ Upload endpoint'leri (`POST /api/upload/image`, `POST /api/upload/images`)
- ✅ Database `product_image` sütunu eklendi
- ✅ `createProduct` ve `updateProduct` fonksiyonları product_image destekliyor

### Frontend Düzeltmeleri

#### 1. `/frontend/src/app/products/create/page.tsx`
**Önceki Sorun:**
```typescript
// Resim sadece base64 olarak local'de saklanıyordu
const reader = new FileReader();
reader.readAsDataURL(file); // ❌ Cloudinary'ye yüklenmiyordu
```

**Yeni Çözüm:**
```typescript
// Cloudinary'ye yükle
const formData = new FormData();
formData.append('image', file);

const response = await fetch(`${API_URL}/upload/image`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const data = await response.json();
setUploadedImage(data.data.url); // ✅ Cloudinary URL'i kaydet
```

**Form Gönderimi:**
```typescript
body: JSON.stringify({
  product_name: formData.product_name,
  // ... diğer alanlar
  product_image: uploadedImage, // ✅ Cloudinary URL'i gönder
})
```

#### 2. `/frontend/src/app/products/[id]/page.tsx` (Düzenleme Sayfası)
Aynı değişiklikler uygulandı:
- ✅ `handleImageUpload`: Cloudinary'ye yükleme
- ✅ `handleSubmit`: `product_image` alanı eklendi
- ✅ Mevcut resmi gösterme: `product_image || image_url`

#### 3. `/frontend/src/types/index.ts`
```typescript
export interface ProductCreateData {
  product_name: string;
  // ... diğer alanlar
  product_image?: string; // ✅ Eklendi
}

export interface Product {
  // ...
  product_image?: string; // ✅ Yeni alan
  image_url?: string; // Deprecated: geriye dönük uyumluluk için
}
```

#### 4. `/frontend/src/app/products/page.tsx` (Liste Sayfası)
```typescript
// Hem yeni hem eski alan için destek
{(product.product_image || product.image_url) ? (
  <img src={product.product_image || product.image_url} />
) : (
  <svg>...</svg> // Placeholder
)}
```

## 🔄 Nasıl Çalışır?

### Ürün Ekleme Akışı
1. Kullanıcı resim seçer
2. **Frontend**: Resim hemen Cloudinary'ye yüklenir (`POST /api/upload/image`)
3. **Cloudinary**: Resmi işler ve URL döndürür
4. **Frontend**: URL state'e kaydedilir (`uploadedImage`)
5. Kullanıcı formu doldurur
6. **Frontend**: Ürün verisiyle birlikte Cloudinary URL'i gönderilir (`product_image`)
7. **Backend**: URL veritabanına kaydedilir

### Teknik Detaylar
- **Maksimum boyut**: 5MB (önceden 900KB idi)
- **Cloudinary ayarları**:
  - Klasör: `iade-yonetim`
  - Max boyut: 1200x1200px
  - Otomatik optimizasyon: ✅
  - Desteklenen formatlar: jpg, jpeg, png, gif, webp

## 🧪 Test Etme
1. Giriş yap
2. "Ürünler" → "Ürün oluştur"
3. Resim seç (max 5MB)
4. Diğer alanları doldur
5. Kaydet
6. ✅ Ürün listesinde resim görünmeli
7. ✅ Ürün detayında resim görünmeli
8. ✅ Veritabanında `product_image` sütununda Cloudinary URL'i olmalı

## 🗄️ Database
```sql
-- Zaten eklendi
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_image TEXT;
```

Örnek kayıt:
```
product_image: "https://res.cloudinary.com/dwdtmlz93/image/upload/v1234567890/iade-yonetim/abc123.jpg"
```

## 📝 Notlar
- `image_url` alanı geriye dönük uyumluluk için korundu
- Öncelik her zaman `product_image` alanına verilir
- Resim yüklemesi opsiyoneldir (zorunlu değil)
- Yükleme sırasında loading state gösterilir
- Hata durumunda kullanıcıya mesaj gösterilir
