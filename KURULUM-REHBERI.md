# 💻 Local Bilgisayarda Kurulum Rehberi

## 🎯 Hızlı Başlangıç (Otomatik)

### Mac/Linux:
```bash
# Script'i çalıştır
curl -O https://raw.githubusercontent.com/yildirimzia/iade-yonetim/claude/project-analysis-011CUoNT5B53Gfb4bVTPZo5J/setup-local.sh
chmod +x setup-local.sh
./setup-local.sh
```

### Windows (Git Bash):
```bash
# Script'i çalıştır
curl -O https://raw.githubusercontent.com/yildirimzia/iade-yonetim/claude/project-analysis-011CUoNT5B53Gfb4bVTPZo5J/setup-local.sh
bash setup-local.sh
```

---

## 📋 Manuel Kurulum

### 1. Repository'yi Clone Et

```bash
# GitHub'dan klonla
git clone https://github.com/yildirimzia/iade-yonetim.git

# Klasöre gir
cd iade-yonetim

# Doğru branch'e geç
git checkout claude/project-analysis-011CUoNT5B53Gfb4bVTPZo5J
```

### 2. Backend Kurulumu

```bash
# Backend klasörüne gir
cd backend

# Dependencies yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle
# Windows: notepad .env
# Mac: open -e .env
# Linux: nano .env
```

**.env dosyasında değiştir:**
```env
DB_PASSWORD=sizin_postgresql_sifreniz
JWT_SECRET=güvenli_bir_secret_key_buraya
```

### 3. Frontend Kurulumu

```bash
# Frontend klasörüne gir
cd ../frontend

# Dependencies yükle
npm install

# .env.local dosyası oluştur
cp .env.local.example .env.local
```

### 4. Database Setup

```bash
# Backend klasöründe
cd backend

# Veritabanını kur
npm run db:setup
```

**Başarılı çıktı:**
```
✅ Users tablosu oluşturuldu
✅ Products tablosu oluşturuldu
✅ Returns tablosu oluşturuldu
✅ Inventory tablosu oluşturuldu
✅ Shipments tablosu oluşturuldu
✅ Admin kullanıcısı oluşturuldu!
```

### 5. Çalıştır

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Tarayıcı:**
```
http://localhost:3000
```

**Giriş:**
- Email: `admin@iadeyonetim.com`
- Şifre: `Admin123!`

---

## 🔄 Güncelleme (Zaten kuruluysa)

```bash
# Klasöre gir
cd iade-yonetim

# Güncel kodu çek
git pull origin claude/project-analysis-011CUoNT5B53Gfb4bVTPZo5J

# Backend güncelle
cd backend
npm install

# Frontend güncelle
cd ../frontend
npm install
```

---

## ⚠️ Gereksinimler

### Yazılımlar:
- **Node.js** v18 veya üzeri - https://nodejs.org/
- **PostgreSQL** v14 veya üzeri - https://www.postgresql.org/download/
- **Git** - https://git-scm.com/downloads

### Versiyonları Kontrol Et:
```bash
node --version    # v18.0.0 veya üzeri
npm --version     # 8.0.0 veya üzeri
psql --version    # 14.0 veya üzeri
git --version     # herhangi bir versiyon
```

---

## 🐛 Sorun Giderme

### PostgreSQL Başlamıyor

**Windows:**
1. Services.msc açın
2. PostgreSQL'i bulun
3. Start yapın

**Mac:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Port Çakışması

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
# Bulunan PID'yi kill edin
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti :5000 | xargs kill -9
```

**Frontend (Port 3000):**
```bash
# Farklı port kullan
PORT=3001 npm run dev
```

### Module Not Found

```bash
# Frontend
cd frontend
rm -rf node_modules .next
npm install

# Backend
cd backend
rm -rf node_modules
npm install
```

### Database Connection Error

**.env dosyasını kontrol edin:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iade_yonetim
DB_USER=postgres
DB_PASSWORD=DOGRU_SIFRE
```

**PostgreSQL'in çalıştığını kontrol edin:**
```bash
psql -U postgres -c "SELECT version();"
```

### TypeScript Hatası

```bash
cd frontend
npx tsc --noEmit
```

---

## 📊 Klasör Yapısı

```
iade-yonetim/
├── backend/
│   ├── config/              # Database config
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth middleware
│   ├── routes/              # API routes
│   ├── scripts/             # Setup scripts
│   ├── .env                 # Environment variables (kendin oluştur)
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies
│   └── server.js            # Main server
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API & utilities
│   │   └── types/           # TypeScript types
│   ├── .env.local           # Environment variables (kendin oluştur)
│   ├── .env.local.example   # Environment template
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript config
│
├── KURULUM-REHBERI.md       # Bu dosya
├── README.md                # Ana döküman
└── setup-local.sh           # Otomatik kurulum scripti
```

---

## 🎯 Başarı Kontrolleri

### Backend:
```bash
curl http://localhost:5000/health
# Response: {"success":true,"message":"İade Yönetim Sistemi API çalışıyor"}
```

### Frontend:
- Tarayıcıda http://localhost:3000 açılıyor
- Login sayfası görünüyor
- Console'da hata yok

### Database:
```bash
psql -U postgres -d iade_yonetim -c "SELECT COUNT(*) FROM users;"
# Response: 1 (admin kullanıcısı)
```

---

## 💡 İpuçları

1. **Her zaman iki terminal kullanın** (biri backend, biri frontend)
2. **PostgreSQL'i daima çalışır durumda tutun**
3. **Git pull sonrası npm install yapmayı unutmayın**
4. **.env dosyalarını asla commit etmeyin**
5. **Development mode'da çalışırken hot reload aktif**

---

## 📞 Yardım

Sorun yaşarsanız:
1. [GitHub Issues](https://github.com/yildirimzia/iade-yonetim/issues)
2. README.md dökümanına bakın
3. Backend/Frontend loglarını kontrol edin

---

**İyi Çalışmalar! 🚀**
