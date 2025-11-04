# 🚀 HIZLI BAŞLANGIÇ REHBERİ

## Adım 1: Gerekli Programlar

Sisteminizde şunlar kurulu olmalı:
- **Node.js** (v18 veya üzeri): https://nodejs.org/
- **PostgreSQL** (v14 veya üzeri): https://www.postgresql.org/download/

## Adım 2: Hızlı Kurulum

### Otomatik Kurulum (Linux/Mac)
```bash
chmod +x kurulum.sh
./kurulum.sh
```

### Manuel Kurulum (Windows veya Linux/Mac)

#### Backend Kurulumu
```bash
cd backend
npm install
cp .env.example .env
```

**backend/.env** dosyasını düzenleyin:
```env
DB_PASSWORD=sizin_postgresql_sifreniz
JWT_SECRET=güvenli_bir_secret_key_buraya
```

#### Frontend Kurulumu
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
```

## Adım 3: Veritabanı Oluşturma

```bash
cd backend
npm run db:setup
```

Bu komut:
- `iade_yonetim` veritabanını oluşturur
- Gerekli tabloları kurar
- Admin kullanıcısı oluşturur

## Adım 4: Uygulamayı Başlatma

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend çalışıyor: http://localhost:5000

### Terminal 2 - Frontend  
```bash
cd frontend
npm run dev
```
Frontend çalışıyor: http://localhost:3000

## Adım 5: İlk Giriş

Tarayıcınızda: **http://localhost:3000**

**Admin Hesabı:**
- Email: `admin@iadeyonetim.com`
- Şifre: `Admin123!`

⚠️ **ÖNEMLİ:** İlk girişten sonra şifrenizi değiştirin!

## Temel Kullanım

### Satıcı Olarak:
1. Kayıt ol butonuna tıklayın
2. Bilgilerinizi girin
3. Dashboard'da ürünlerinizi ekleyin
4. İadelerinizi takip edin

### Admin Olarak:
1. Admin hesabıyla giriş yapın
2. Gelen iadeleri sisteme ekleyin
3. Envanterdeki ürünleri yönetin
4. Kargoları planlayın ve gönder in

## Sorun Giderme

### Backend başlamıyor
- PostgreSQL çalışıyor mu kontrol edin
- .env dosyası doğru mu kontrol edin
- Port 5000 kullanımda mı kontrol edin

### Frontend bağlanamıyor  
- Backend çalışıyor mu kontrol edin
- .env.local dosyası doğru mu kontrol edin

### Veritabanı hatası
```bash
# Veritabanını sıfırla ve tekrar kur
cd backend
npm run db:setup
```

## Özellikler

✅ Çok satıcılı sistem
✅ İade takibi
✅ Envanter yönetimi
✅ Kargo planlaması
✅ Dashboard ve istatistikler
✅ JWT Authentication
✅ Responsive tasarım

## İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---
**İyi Çalışmalar! 🎉**
