# 🏭 İade Yönetim Sistemi

Türkiye'den satış yapan satıcılar için Bulgaristan merkezli iade ve kargo yönetim platformu.

## 🎯 Özellikler

### Satıcı Paneli
- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ Kendi ürünlerini görüntüleme ve yönetme
- ✅ İade durumlarını takip etme
- ✅ Kargo durumu bildirimleri
- ✅ İstatistik ve raporlar

### Admin Paneli
- ✅ Tüm satıcıları ve ürünleri görüntüleme
- ✅ İade onaylama/reddetme
- ✅ Envanter yönetimi
- ✅ Kargo planlaması
- ✅ Toplu işlemler

## 🛠️ Teknolojiler

### Backend
- Node.js v18+
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt (şifre hash)

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Axios
- Context API (state management)

## 📦 Kurulum

### Gereksinimler
- Node.js v18 veya üzeri
- PostgreSQL 14 veya üzeri
- npm veya yarn

### 1. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/iade_yonetim
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

Veritabanını oluşturun:
```bash
npm run db:setup
```

Backend'i başlatın:
```bash
npm run dev
```

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
```

`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Frontend'i başlatın:
```bash
npm run dev
```

## 🚀 Kullanım

1. Backend: `http://localhost:5000`
2. Frontend: `http://localhost:3000`

### İlk Admin Hesabı
Sistem ilk çalıştırıldığında otomatik admin hesabı oluşturulur:
- Email: `admin@iadeyonetim.com`
- Şifre: `Admin123!`

**⚠️ Üretim ortamında mutlaka değiştirin!**

## 📊 Veritabanı Şeması

### Users (Müşteriler)
- id, email, password, name, role (admin/seller), phone, created_at

### Products (Ürünler)
- id, seller_id, product_name, sku, barcode, category, original_price, notes

### Returns (İadeler)
- id, product_id, seller_id, return_date, reason, status, tracking_number, photos

### Inventory (Envanter)
- id, product_id, quantity, condition, location, last_updated

### Shipments (Kargolar)
- id, return_id, shipping_date, tracking_number, carrier, status, recipient

## 🔐 API Endpoints

### Auth
- POST `/api/auth/register` - Yeni satıcı kaydı
- POST `/api/auth/login` - Giriş
- GET `/api/auth/profile` - Profil bilgisi

### Products (Satıcı)
- GET `/api/products` - Kendi ürünlerini listele
- POST `/api/products` - Yeni ürün ekle
- PUT `/api/products/:id` - Ürün güncelle
- DELETE `/api/products/:id` - Ürün sil

### Returns
- GET `/api/returns` - İadeleri listele
- POST `/api/returns` - Yeni iade ekle
- PUT `/api/returns/:id` - İade güncelle
- GET `/api/returns/:id` - İade detayı

### Inventory (Admin)
- GET `/api/inventory` - Envanter listesi
- PUT `/api/inventory/:id` - Envanter güncelle

### Shipments (Admin)
- POST `/api/shipments` - Yeni kargo oluştur
- PUT `/api/shipments/:id` - Kargo güncelle
- GET `/api/shipments` - Kargo listesi

## 📱 Ekran Görüntüleri

### Satıcı Paneli
- Dashboard: Ürün sayısı, bekleyen iadeler, kargo durumları
- Ürünlerim: Tüm ürünlerin listesi
- İadeler: İade durumları ve detayları
- Profil: Hesap bilgileri

### Admin Paneli
- Dashboard: Sistem geneli istatistikler
- Satıcılar: Tüm satıcı listesi
- Envanter: Depodaki tüm ürünler
- Kargolar: Kargo planlaması ve takip

## 🔄 İş Akışı

1. **İade Geldiğinde (Admin)**
   - Ürün bilgilerini sisteme gir
   - Fotoğraf yükle
   - Durumu belirle (iyi, hasarlı, eksik parça)
   - Satıcıya bildirim gönder

2. **Tekrar Satış (Satıcı)**
   - Sistemden ürünü seç
   - Kargo talep et
   - Alıcı bilgilerini gir

3. **Kargo Süreci (Admin)**
   - Kargo şirketini seç
   - Takip numarasını gir
   - Ürünü gönder
   - Durumu güncelle

## 🐛 Sorun Giderme

### Backend başlamıyor
- PostgreSQL çalışıyor mu kontrol edin
- `.env` dosyası doğru mu kontrol edin
- Port 5000 kullanımda mı kontrol edin

### Frontend bağlanamıyor
- Backend çalışıyor mu kontrol edin
- `.env.local` dosyası doğru mu kontrol edin

## 📝 Lisans

MIT License - İstediğiniz gibi kullanabilirsiniz.

## 🤝 Destek

Sorularınız için: [GitHub Issues](https://github.com/your-repo/issues)

---

**Geliştirici Notu:** Bu sistem local ortam için hazırlanmıştır. Canlı ortama almadan önce:
- JWT_SECRET'ı değiştirin
- Veritabanı şifrelerini güçlendirin
- HTTPS kullanın
- Rate limiting ekleyin
- Dosya yükleme limitleri koyun
