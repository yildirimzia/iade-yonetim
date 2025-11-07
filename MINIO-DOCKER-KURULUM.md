# 🐳 MinIO + Docker Kurulum Rehberi

## 📋 Gereksinimler
- Docker Desktop yüklü olmalı
- Docker Compose v2+
- Node.js 18+ (lokal geliştirme için)

## 🚀 Hızlı Başlangıç

### 1. Paketleri Güncelle
```bash
cd backend
npm install
```

Yeni paketler:
- ✅ `minio` - MinIO SDK
- ✅ `uuid` - Benzersiz dosya isimleri
- ❌ `cloudinary` - Kaldırıldı
- ❌ `multer-storage-cloudinary` - Kaldırıldı

### 2. Docker Container'ları Başlat
```bash
# Ana dizinde (iade-yonetim/)
docker-compose up -d
```

Bu komut başlatır:
- ✅ PostgreSQL (port 5432)
- ✅ MinIO (port 9000 API, 9001 Console)
- ✅ Backend API (port 5000)
- ✅ Frontend Next.js (port 3000)

### 3. MinIO Console'a Eriş
Tarayıcıda aç: **http://localhost:9001**

**Giriş Bilgileri:**
- Username: `minioadmin`
- Password: `minioadmin123`

### 4. Veritabanını Hazırla
```bash
# Container içinde veya lokal terminalde
cd backend
npm run db:setup
```

## 🔧 Konfigürasyon

### Backend `.env` Dosyası
```env
# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=iade-yonetim
```

**Docker içinde çalışırken:**
- `MINIO_ENDPOINT=minio` (service name)

**Lokal çalışırken:**
- `MINIO_ENDPOINT=localhost`

## 📂 MinIO Bucket Yapısı

Otomatik oluşturulur:
```
iade-yonetim/               (bucket)
├── products/               (ürün resimleri)
│   ├── uuid-1.jpg
│   ├── uuid-2.png
│   └── ...
├── profiles/               (profil fotoğrafları)
└── returns/                (iade fotoğrafları)
```

## 🌐 URL Formatı

**MinIO URL Yapısı:**
```
http://localhost:9000/iade-yonetim/products/uuid.jpg
```

**Cloudinary'den Farkı:**
- ❌ Cloudinary: `https://res.cloudinary.com/cloud-name/image/upload/v123/folder/file.jpg`
- ✅ MinIO: `http://localhost:9000/bucket-name/folder/file.jpg`

Frontend'de değişiklik gerekmez, API aynı `url` field'ını döndürür.

## 🧪 Test Etme

### 1. MinIO Sağlık Kontrolü
```bash
curl http://localhost:9000/minio/health/live
```

Yanıt: `200 OK`

### 2. Resim Yükleme Testi
```bash
# Backend container'ına bağlan
docker exec -it iade-backend sh

# Test isteği (token gerekli)
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/test.jpg"
```

### 3. MinIO Console'dan Manuel Yükleme
1. http://localhost:9001 aç
2. `iade-yonetim` bucket'ına tıkla
3. "Upload" butonuna bas
4. Dosya seç ve yükle

## 🔄 Cloudinary'den Geçiş

### Değişen Dosyalar
✅ **Backend:**
- `config/cloudinary.js` → `config/minio.js`
- `routes/upload.js` (MinIO için güncellendi)
- `package.json` (minio paketi eklendi)
- `.env` (MinIO credentials)

❌ **Frontend:**
- Değişiklik gerekmez (API response aynı format)

### Migration Adımları
1. ✅ Eski Cloudinary resimleri duruma göre migrate edilebilir
2. ✅ Yeni yüklemeler MinIO'ya gider
3. ✅ Veritabanında sadece URL değişir

## 📊 Docker Komutları

### Container Yönetimi
```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Backend logları
docker-compose logs -f backend

# MinIO logları
docker-compose logs -f minio

# Servisleri durdur
docker-compose down

# Servisleri durdur ve volume'ları sil
docker-compose down -v

# Yeniden başlat
docker-compose restart
```

### Container İçine Gir
```bash
# Backend
docker exec -it iade-backend sh

# PostgreSQL
docker exec -it iade-postgres psql -U postgres -d iade_yonetim

# MinIO
docker exec -it iade-minio sh
```

## 🔒 Güvenlik

### Production Ayarları
```env
# .env (Production)
MINIO_ENDPOINT=minio.example.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=<strong-access-key>
MINIO_SECRET_KEY=<strong-secret-key>
```

### Öneriler
- ✅ Güçlü access/secret key kullan
- ✅ SSL/TLS etkinleştir (production)
- ✅ Bucket policy'yi kontrol et
- ✅ CORS ayarlarını yapılandır
- ✅ Rate limiting ekle

## 🐛 Sorun Giderme

### MinIO'ya Erişilemiyor
```bash
# Container çalışıyor mu?
docker ps | grep minio

# Logları kontrol et
docker-compose logs minio

# Bucket oluştu mu?
docker exec -it iade-minio mc ls local/iade-yonetim
```

### Resim Yüklenmiyor
1. **Backend loglarını kontrol et:**
   ```bash
   docker-compose logs -f backend
   ```

2. **MinIO credentials doğru mu?**
   ```bash
   # .env dosyasını kontrol et
   cat backend/.env | grep MINIO
   ```

3. **Bucket public mu?**
   - MinIO Console → Buckets → iade-yonetim → Access Policy → Public

### Database Bağlantı Hatası
```bash
# PostgreSQL çalışıyor mu?
docker exec -it iade-postgres pg_isready

# Bağlantı test et
docker exec -it iade-postgres psql -U postgres -d iade_yonetim -c "SELECT 1;"
```

## 📈 Performans

### MinIO Avantajları
- ✅ Hızlı: Lokal network
- ✅ Ücretsiz: Sınırsız kullanım
- ✅ Kontrol: Kendi sunucun
- ✅ S3 Uyumlu: AWS SDK kullanılabilir

### Cloudinary'ye Göre
| Özellik | MinIO | Cloudinary |
|---------|-------|------------|
| Maliyet | Ücretsiz | Ücretli (5GB sonrası) |
| Hız | Lokal (hızlı) | CDN (global) |
| Ölçeklendirme | Manuel | Otomatik |
| Image Optimization | Manuel | Otomatik |
| CDN | Yok | Var |

## 🔄 Volume Yönetimi

### Backup
```bash
# MinIO data backup
docker run --rm -v iade-yonetim_minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio-backup.tar.gz /data

# PostgreSQL backup
docker exec iade-postgres pg_dump -U postgres iade_yonetim > backup.sql
```

### Restore
```bash
# MinIO restore
docker run --rm -v iade-yonetim_minio_data:/data -v $(pwd):/backup alpine tar xzf /backup/minio-backup.tar.gz -C /

# PostgreSQL restore
cat backup.sql | docker exec -i iade-postgres psql -U postgres -d iade_yonetim
```

## 🎯 Sonraki Adımlar

1. ✅ MinIO başarıyla çalışıyor
2. ✅ Resim yükleme test edildi
3. ⏭️ Production için SSL/TLS yapılandır
4. ⏭️ Nginx reverse proxy ekle (opsiyonel)
5. ⏭️ Image optimization servis ekle (opsiyonel)

## 📞 Yardım

**MinIO Dökümantasyon:**
- https://min.io/docs/minio/linux/index.html

**Docker Compose:**
- https://docs.docker.com/compose/
