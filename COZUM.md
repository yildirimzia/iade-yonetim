# 🔧 Module Not Found Hatası - Çözüm

## ❌ Hata:
```
Module not found: Can't resolve '@/lib/api'
```

## ✅ Çözüm Adımları:

### 1. Dependencies Yükle (ZORUNLU)
```bash
cd frontend
npm install
```

Bu komut şunları yükleyecek:
- TypeScript
- @types/react
- @types/node
- Next.js dependencies
- Diğer tüm paketler

### 2. Cache Temizle (Önerilen)
```bash
# .next klasörünü sil
rm -rf .next

# node_modules ve package-lock.json temizle (opsiyonel)
rm -rf node_modules package-lock.json
npm install
```

### 3. Dev Server'ı Başlat
```bash
npm run dev
```

## 📋 Tam Kurulum (Sıfırdan)

### Backend:
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenle (PostgreSQL bilgileri)
npm run db:setup
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## ⚠️ Yaygın Sorunlar

### 1. Port Çakışması
```bash
# Port 3000 kullanımda ise
lsof -ti:3000 | xargs kill -9

# Veya farklı port kullan
PORT=3001 npm run dev
```

### 2. TypeScript Hatası
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### 3. Cache Sorunu
```bash
# Tüm cache'leri temizle
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## 🎯 Başarı Kontrolü

Dev server başladığında göreceksiniz:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

Tarayıcıda açın:
- Login sayfası yüklenecek
- Console'da hata olmamalı
- Module hatası gitmeli

## 📝 Not

TypeScript dosyaları zaten mevcut:
- ✅ src/lib/api.ts
- ✅ src/lib/auth.ts
- ✅ src/types/index.ts
- ✅ src/components/*.tsx
- ✅ src/app/**/*.tsx

Sadece `npm install` yapmanız yeterli!
