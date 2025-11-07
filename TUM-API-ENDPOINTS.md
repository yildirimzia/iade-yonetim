# 🔥 İADE YÖNETİM SİSTEMİ - TÜM API ENDPOINT'LERİ

## 📋 Tam Endpoint Listesi

### 🔐 1. AUTH (`/api/auth`)

| Method | Endpoint | Açıklama | Auth | Rol |
|--------|----------|----------|------|-----|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı | ❌ | Public |
| POST | `/api/auth/login` | Kullanıcı girişi | ❌ | Public |
| GET | `/api/auth/profile` | Profil bilgilerini getir | ✅ | User |
| PUT | `/api/auth/profile` | Profil güncelle | ✅ | User |
| PUT | `/api/auth/change-password` | Şifre değiştir | ✅ | User |

**Redux Status:** ✅ Eklendi (authSlice.ts)

---

### 📦 2. PRODUCTS (`/api/products`)

| Method | Endpoint | Açıklama | Auth | Rol |
|--------|----------|----------|------|-----|
| GET | `/api/products` | Ürünleri listele | ✅ | User |
| GET | `/api/products/all` | Tüm ürünler (admin/seller) | ✅ | Seller/Admin |
| GET | `/api/products/stats` | Ürün istatistikleri | ✅ | User |
| GET | `/api/products/categories` | Kategorileri listele | ✅ | User |
| GET | `/api/products/:id` | Tek ürün detayı | ✅ | User |
| POST | `/api/products` | Yeni ürün ekle | ✅ | User |
| PUT | `/api/products/:id` | Ürün güncelle | ✅ | User |
| PUT | `/api/products/:id/status` | Ürün durumu güncelle | ✅ | User |
| DELETE | `/api/products/:id` | Ürün sil | ✅ | User |

**Redux Status:** ✅ Eklendi (productsSlice.ts)

---

### 👥 3. USERS (`/api/users`)

| Method | Endpoint | Açıklama | Auth | Rol |
|--------|----------|----------|------|-----|
| GET | `/api/users` | Tüm kullanıcıları listele | ✅ | Admin |
| GET | `/api/users/:id` | Kullanıcı detayı | ✅ | Admin |
| GET | `/api/users/:id/products` | Kullanıcının ürünleri | ✅ | Admin |

**Redux Status:** ✅ Eklendi (usersSlice.ts)

---

### 🔄 4. RETURNS (`/api/returns`)

| Method | Endpoint | Açıklama | Auth | Rol |
|--------|----------|----------|------|-----|
| GET | `/api/returns` | İadeleri listele | ✅ | User |
| GET | `/api/returns/stats` | İade istatistikleri | ✅ | User |
| GET | `/api/returns/:id` | İade detayı | ✅ | User |
| POST | `/api/returns` | Yeni iade oluştur | ✅ | Admin |
| PUT | `/api/returns/:id` | İade güncelle | ✅ | User |
| DELETE | `/api/returns/:id` | İade sil | ✅ | Admin |

**Redux Status:** ✅ Eklendi (returnsSlice.ts)

---

### 📊 5. INVENTORY (`/api/inventory`)

| Method | Endpoint | Açıklama | Auth | Rol |
|--------|----------|----------|------|-----|
| GET | `/api/inventory` | Envanter listele | ✅ | Admin |
| GET | `/api/inventory/stats` | Envanter istatistikleri | ✅ | Admin |
| GET | `/api/inventory/locations` | Lokasyonları listele | ✅ | Admin |
| GET | `/api/inventory/:id` | Envanter detayı | ✅ | Admin |
| PUT | `/api/inventory/:id` | Envanter güncelle | ✅ | Admin |
| DELETE | `/api/inventory/:id` | Envanter sil | ✅ | Admin |

**Redux Status:** ✅ Eklendi (inventorySlice.ts)

---

### 🚚 6. SHIPMENTS (`/api/shipments`)

| Method | Endpoint | Açıklama | Auth | Rol |
|--------|----------|----------|------|-----|
| GET | `/api/shipments` | Kargoları listele | ✅ | User |
| GET | `/api/shipments/stats` | Kargo istatistikleri | ✅ | User |
| GET | `/api/shipments/:id` | Kargo detayı | ✅ | User |
| POST | `/api/shipments` | Yeni kargo oluştur | ✅ | Admin |
| PUT | `/api/shipments/:id` | Kargo güncelle | ✅ | Admin |
| DELETE | `/api/shipments/:id` | Kargo sil | ✅ | Admin |

**Redux Status:** ✅ Eklendi (shipmentsSlice.ts)

---

## 🎯 Redux Store Durumu

### ✅ Tamamlanan Slice'lar (6/6)

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,           // ✅ /api/auth
    products: productsReducer,   // ✅ /api/products
    users: usersReducer,         // ✅ /api/users
    returns: returnsReducer,     // ✅ /api/returns
    inventory: inventoryReducer, // ✅ /api/inventory
    shipments: shipmentsReducer, // ✅ /api/shipments
  },
});
```

---

## 📝 Eksik Redux Endpoint'ler

### ⚠️ Henüz Slice'a Eklenmemiş Endpoint'ler:

#### Auth Slice'a Eklenecekler:
- ❌ `PUT /api/auth/profile` - Profil güncelleme
- ❌ `PUT /api/auth/change-password` - Şifre değiştirme

#### Products Slice'a Eklenecekler:
- ❌ `GET /api/products/all` - Tüm ürünler
- ❌ `GET /api/products/stats` - İstatistikler
- ❌ `GET /api/products/categories` - Kategoriler
- ❌ `PUT /api/products/:id/status` - Durum güncelleme

#### Users Slice'a Eklenecekler:
- ❌ `GET /api/users/:id/products` - Kullanıcı ürünleri

#### Returns Slice'a Eklenecekler:
- ❌ `GET /api/returns/stats` - İstatistikler

#### Inventory Slice'a Eklenecekler:
- ❌ `GET /api/inventory/stats` - İstatistikler
- ❌ `GET /api/inventory/locations` - Lokasyonlar

#### Shipments Slice'a Eklenecekler:
- ❌ `GET /api/shipments/stats` - İstatistikler

---

## 📊 Özet

| Kategori | Toplam Endpoint | Redux'ta Mevcut | Eksik |
|----------|----------------|-----------------|-------|
| Auth | 5 | 2 (login, register) | 3 |
| Products | 9 | 5 (CRUD) | 4 |
| Users | 3 | 2 (list, detail) | 1 |
| Returns | 6 | 5 (CRUD) | 1 |
| Inventory | 6 | 4 (CRUD except create) | 2 |
| Shipments | 6 | 5 (CRUD) | 1 |
| **TOPLAM** | **35** | **23** | **12** |

---

## 🚀 Öneriler

### 1. Stats Endpoint'leri için Yeni Thunk'lar Ekle

Her slice'a stats endpoint'i eklenebilir:

```typescript
// productsSlice.ts
export const fetchProductStats = createAsyncThunk(
  'products/fetchStats',
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/products/stats`);
    // ...
  }
);
```

### 2. Auth Slice'ı Genişlet

```typescript
// authSlice.ts
export const updateProfile = createAsyncThunk(...);
export const changePassword = createAsyncThunk(...);
```

### 3. Categories için Ayrı Slice (Opsiyonel)

```typescript
// categoriesSlice.ts
export const fetchCategories = createAsyncThunk(...);
```

---

## ✅ Sonuç

- **Temel CRUD işlemleri:** ✅ Tamamlandı
- **Stats endpoint'leri:** ⏳ Eklenebilir
- **Özel endpoint'ler:** ⏳ İhtiyaca göre eklenebilir

Tüm kritik endpoint'ler Redux'ta mevcut! 🎉
