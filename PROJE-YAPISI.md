# 📁 PROJE YAPISI

## Klasör Yapısı

```
iade-yonetim-sistemi/
│
├── backend/                     # Node.js + Express API
│   ├── config/                  # Yapılandırma dosyaları
│   │   └── database.js          # PostgreSQL bağlantısı
│   │
│   ├── controllers/             # İş mantığı
│   │   ├── authController.js    # Giriş/Kayıt
│   │   ├── productsController.js # Ürün yönetimi
│   │   ├── returnsController.js  # İade yönetimi
│   │   ├── inventoryController.js # Envanter
│   │   └── shipmentsController.js # Kargo
│   │
│   ├── middleware/              # Middleware'ler
│   │   └── auth.js              # JWT doğrulama
│   │
│   ├── routes/                  # API route'ları
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── returns.js
│   │   ├── inventory.js
│   │   └── shipments.js
│   │
│   ├── scripts/                 # Yardımcı scriptler
│   │   └── setupDatabase.js     # DB kurulum
│   │
│   ├── uploads/                 # Yüklenen dosyalar
│   ├── .env.example             # Örnek env dosyası
│   ├── package.json
│   └── server.js                # Ana sunucu dosyası
│
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── layout.js        # Ana layout
│   │   │   ├── page.js          # Ana sayfa
│   │   │   └── login/           # Login sayfası
│   │   │       └── page.js
│   │   │
│   │   ├── lib/                 # Yardımcı fonksiyonlar
│   │   │   └── api.js           # API servisleri
│   │   │
│   │   └── styles/              # CSS dosyaları
│   │       └── globals.css
│   │
│   ├── public/                  # Statik dosyalar
│   ├── .env.local.example       # Örnek env dosyası
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── README.md                    # Ana döküman
├── HIZLI-BASLANGIC.md          # Hızlı başlangıç
└── kurulum.sh                   # Otomatik kurulum scripti
```

## Veritabanı Tabloları

### users
- Kullanıcı bilgileri (satıcılar ve admin)
- Roller: admin, seller

### products
- Ürün bilgileri
- Her ürün bir satıcıya ait

### returns
- İade kayıtları
- Durum takibi (pending, received, shipped, vb.)

### inventory
- Depodaki ürünler
- Konum ve durum bilgisi

### shipments
- Kargo kayıtları
- Tracking bilgileri

### notifications
- Kullanıcı bildirimleri (gelecek özellik)

## API Endpoints

### Authentication
- POST `/api/auth/register` - Yeni kullanıcı
- POST `/api/auth/login` - Giriş
- GET `/api/auth/profile` - Profil bilgisi
- PUT `/api/auth/profile` - Profil güncelle
- PUT `/api/auth/change-password` - Şifre değiştir

### Products
- GET `/api/products` - Liste
- GET `/api/products/:id` - Detay
- POST `/api/products` - Yeni ürün
- PUT `/api/products/:id` - Güncelle
- DELETE `/api/products/:id` - Sil
- GET `/api/products/categories` - Kategoriler

### Returns
- GET `/api/returns` - Liste
- GET `/api/returns/:id` - Detay
- GET `/api/returns/stats` - İstatistikler
- POST `/api/returns` - Yeni iade
- PUT `/api/returns/:id` - Güncelle
- DELETE `/api/returns/:id` - Sil

### Inventory
- GET `/api/inventory` - Liste
- GET `/api/inventory/:id` - Detay
- GET `/api/inventory/stats` - İstatistikler
- GET `/api/inventory/locations` - Lokasyonlar
- PUT `/api/inventory/:id` - Güncelle
- DELETE `/api/inventory/:id` - Sil

### Shipments
- GET `/api/shipments` - Liste
- GET `/api/shipments/:id` - Detay
- GET `/api/shipments/stats` - İstatistikler
- POST `/api/shipments` - Yeni kargo
- PUT `/api/shipments/:id` - Güncelle
- DELETE `/api/shipments/:id` - Sil

## Teknoloji Detayları

### Backend Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Veritabanı
- **JWT**: Token-based authentication
- **bcryptjs**: Şifre hashleme
- **cors**: Cross-origin requests
- **multer**: Dosya yükleme (hazır)

### Frontend Stack
- **Next.js 14**: React framework
- **React 18**: UI library
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **date-fns**: Tarih işlemleri

## Güvenlik Özellikleri

✅ JWT token authentication
✅ Bcrypt şifre hashleme
✅ Role-based access control (RBAC)
✅ SQL injection koruması (parameterized queries)
✅ CORS yapılandırması
✅ Input validation

## Performans Optimizasyonları

✅ Database indexing
✅ Pagination
✅ Lazy loading (frontend)
✅ API response caching (hazır)

## Gelecek Özellikler (TODO)

⏳ Dosya yükleme (ürün fotoğrafları)
⏳ Email bildirimleri
⏳ Dashboard grafikleri
⏳ Excel export/import
⏳ QR kod ile ürün takibi
⏳ Mobil uygulama API'si
⏳ Multi-language support

## Geliştirme Notları

- Backend: `npm run dev` ile otomatik restart
- Frontend: Hot reload aktif
- Veritabanı: Migration sistemi eklenebilir
- Test: Jest/Mocha eklenebilir

## Deployment Önerileri

### Backend
- Heroku, Railway, DigitalOcean
- PM2 ile process management
- Nginx reverse proxy

### Frontend
- Vercel (önerilen)
- Netlify
- DigitalOcean App Platform

### Database
- Heroku Postgres
- DigitalOcean Managed Database
- AWS RDS

---

Bu yapı, kolayca genişletilebilir ve ölçeklenebilir bir mimari sunar.
