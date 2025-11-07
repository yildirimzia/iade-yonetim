# 🚀 Coolify Deployment Rehberi

Bu rehber, İade Yönetim sistemini Coolify'da deploy etmeniz için adım adım talimatlar içerir.

## 📋 Ön Gereksinimler

- ✅ Coolify kurulu bir sunucu
- ✅ Domain adı (örn: `yourdomain.com`)
- ✅ GitHub repository'si (public veya private)
- ✅ En az 2GB RAM, 20GB disk alanı

---

## 🎯 Adım 1: GitHub Repository Hazırlığı

### 1.1 .gitignore Kontrolü
`.gitignore` dosyanızda bu satırların olduğundan emin olun:

```
.env.production
.env.local
node_modules/
*.log
```

### 1.2 Kodu GitHub'a Push Edin

```bash
git add .
git commit -m "Production deployment hazırlığı"
git push origin master
```

---

## 🛠️ Adım 2: Coolify'da Proje Oluşturma

### 2.1 Yeni Proje Oluştur
1. Coolify Dashboard → **Projects** → **+ Add**
2. Proje adı: `iade-yonetim`
3. **Create Project**

### 2.2 Environment Oluştur
1. Yeni oluşturduğunuz projeye girin
2. **+ Add Environment**
3. Environment adı: `production`
4. **Create Environment**

---

## 📦 Adım 3: Resource Ekleme (Docker Compose)

### 3.1 Docker Compose Resource Ekle
1. `production` environment'ına girin
2. **+ Add Resource** → **Docker Compose**

### 3.2 Git Repository Bağla
1. **Source** → **GitHub** seçin
2. Repository: `yildirimzia/iade-yonetim`
3. Branch: `master`
4. **Compose File**: `docker-compose.prod.yml`

### 3.3 Build Pack Ayarları
- **Build Pack**: Docker Compose
- **Compose File Path**: `./docker-compose.prod.yml`

---

## 🔐 Adım 4: Environment Variables Ekleme

### 4.1 Coolify'da Environment Variables Bölümüne Git
Settings → **Environment Variables** → **+ Add**

### 4.2 Aşağıdaki Değişkenleri Ekleyin:

**Database:**
```
DB_NAME=iade_yonetim
DB_USER=postgres
DB_PASSWORD=SuperGuvenliSifre123!
```

**JWT:**
```bash
# Terminal'de güvenli secret oluşturun:
openssl rand -base64 64
# Çıktıyı aşağıya yapıştırın
JWT_SECRET=BURAYA_OPENSSL_CIKTISINI_YAPIŞTIR
```

**MinIO:**
```
MINIO_ACCESS_KEY=minio_admin_2024
MINIO_SECRET_KEY=MinioGuvenliSifre987!
MINIO_BUCKET=iade-yonetim
MINIO_PORT=9000
MINIO_CONSOLE_PORT=9001
MINIO_PUBLIC_URL=https://storage.YOURDOMAIN.com
```

**Email:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**API URLs:**
```
BACKEND_PORT=5000
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=https://api.YOURDOMAIN.com
```

> **ÖNEMLİ:** `YOURDOMAIN.com` yerlerine kendi domain'inizi yazın!

---

## 🌐 Adım 5: Domain Ayarları

### 5.1 Frontend Domain
1. **frontend** servisine tıklayın
2. **Domains** → **+ Add Domain**
3. Domain: `yourdomain.com` veya `app.yourdomain.com`
4. **Enable HTTPS** ✅ (Coolify otomatik Let's Encrypt sertifikası oluşturur)

### 5.2 Backend Domain
1. **backend** servisine tıklayın
2. **Domains** → **+ Add Domain**
3. Domain: `api.yourdomain.com`
4. **Enable HTTPS** ✅

### 5.3 MinIO Domain (Opsiyonel)
1. **minio** servisine tıklayın
2. **Domains** → **+ Add Domain**
3. API Domain: `storage.yourdomain.com` (port 9000)
4. Console Domain: `minio-console.yourdomain.com` (port 9001)
5. **Enable HTTPS** ✅

---

## 🚀 Adım 6: Deploy!

### 6.1 İlk Deploy
1. Resource ana sayfasına dönün
2. **Deploy** butonuna tıklayın
3. Logları izleyin (Build → Deploy → Running)

### 6.2 Deploy Sürecini İzleme
```
✓ Cloning repository...
✓ Building images...
✓ Starting services...
  - postgres (healthy)
  - minio (healthy)
  - backend (starting...)
  - frontend (starting...)
✓ All services running!
```

---

## 🔍 Adım 7: Doğrulama ve Test

### 7.1 Servislerin Çalıştığını Kontrol Edin

**Frontend:**
```
https://yourdomain.com
```
- Login sayfası açılmalı

**Backend:**
```
https://api.yourdomain.com/api/health
```
- `{"status": "ok"}` dönmeli

**MinIO Console:**
```
https://minio-console.yourdomain.com
```
- MinIO login ekranı açılmalı
- Username: `minio_admin_2024` (MINIO_ACCESS_KEY)
- Password: `MinioGuvenliSifre987!` (MINIO_SECRET_KEY)

### 7.2 Database Kurulumu
Backend container'ına bağlanın:

```bash
# Coolify Terminal'den
docker exec -it iade-backend-prod sh

# Database setup script'ini çalıştır
npm run setup:db
```

---

## 📊 Adım 8: MinIO Public Access Ayarı

### 8.1 MinIO Console'a Giriş Yapın
1. `https://minio-console.yourdomain.com` adresine gidin
2. Giriş yapın

### 8.2 Bucket Policy Ayarı
1. **Buckets** → `iade-yonetim` → **Manage**
2. **Access Policy** → **Custom**
3. Aşağıdaki policy'yi ekleyin:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["*"]
      },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::iade-yonetim/products/*"]
    }
  ]
}
```

4. **Save**

---

## ✅ Adım 9: İlk Test

### 9.1 Kullanıcı Kaydı
1. `https://yourdomain.com/register` adresine gidin
2. Yeni bir hesap oluşturun

### 9.2 Ürün Ekleme ve Resim Upload
1. Login olun
2. Ürün ekleyin
3. Resim yükleyin
4. Sayfayı yenileyin → Resim hala görünmeli ✅

---

## 🔧 Sorun Giderme

### Backend Çalışmıyor
```bash
# Loglara bakın
docker logs iade-backend-prod

# Yaygın sorunlar:
# - DB_PASSWORD yanlış
# - JWT_SECRET eksik
# - MINIO_ENDPOINT yanlış (minio olmalı, localhost değil!)
```

### Frontend API'ye Bağlanamıyor
```bash
# NEXT_PUBLIC_API_URL doğru mu kontrol edin
# Coolify env variables'da:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Resimler Görünmüyor
```bash
# MinIO Public URL doğru mu?
MINIO_PUBLIC_URL=https://storage.yourdomain.com

# MinIO bucket policy set edildi mi?
# MinIO Console → Buckets → Access Policy kontrol et
```

### SSL Sertifikası Hatası
```bash
# Coolify otomatik Let's Encrypt kullanır
# Domain'in DNS kayıtları doğru mu kontrol edin:

A Record: yourdomain.com → SUNUCU_IP
A Record: api.yourdomain.com → SUNUCU_IP
A Record: storage.yourdomain.com → SUNUCU_IP
```

---

## 📝 DNS Ayarları Örneği

Domain registrar'ınızda (GoDaddy, Namecheap, vb.) bu kayıtları ekleyin:

```
Type    Host                    Value               TTL
A       @                       123.456.789.10      3600
A       api                     123.456.789.10      3600
A       storage                 123.456.789.10      3600
A       minio-console           123.456.789.10      3600
```

> `123.456.789.10` yerine Coolify sunucunuzun IP'sini yazın!

---

## 🔄 Güncelleme (Yeni Kod Deploy)

Kod değişikliği yaptığınızda:

```bash
# Local'de
git add .
git commit -m "Yeni özellik eklendi"
git push origin master

# Coolify'da
# Resource sayfasında "Redeploy" butonuna tıklayın
# Veya otomatik deployment ayarlayın (Webhook)
```

---

## 🎉 Tebrikler!

Artık production'da çalışan bir sistem var! 

**Faydalı Linkler:**
- Frontend: `https://yourdomain.com`
- API: `https://api.yourdomain.com`
- MinIO Console: `https://minio-console.yourdomain.com`
- Coolify Dashboard: `https://your-coolify-server.com`

---

## 📞 Destek

Sorun yaşarsanız:
1. Coolify loglarını kontrol edin
2. Docker container loglarına bakın: `docker logs [container-name]`
3. GitHub Issues'da sorun açın
