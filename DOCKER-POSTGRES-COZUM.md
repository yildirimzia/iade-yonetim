# 🐳 Docker PostgreSQL Bağlantı Hatası Çözümü

## ❌ Hata
```
"role \"postgres\" does not exist"
```

## 🔍 Sorun Tespiti

PostgreSQL Docker container'ınız farklı bir kullanıcı adı ile oluşturulmuş. Container'ınızın bilgilerini kontrol edelim.

## 🎯 Çözüm Adımları

### Adım 1: Container Bilgilerini Kontrol Et

```bash
# Container çalışıyor mu?
docker ps | grep iade-postgres

# Container detaylarını gör
docker inspect iade-postgres | grep -A 10 "Env"
```

Bu komut size POSTGRES_USER ve POSTGRES_PASSWORD değerlerini gösterecek.

### Adım 2: Kullanıcı Adını ve Şifreyi Öğren

Container içine gir ve kullanıcıları listele:

```bash
# Container'a bağlan
docker exec -it iade-postgres psql -U postgres

# Eğer "postgres" kullanıcısı yoksa, alternatif kullanıcı adını dene:
docker exec -it iade-postgres psql -U admin
# veya
docker exec -it iade-postgres psql -U root
# veya container oluştururken kullandığınız kullanıcı adını
```

Container içinde tüm kullanıcıları görmek için:

```sql
\du
```

Çıkmak için:
```sql
\q
```

### Adım 3A: Backend .env'yi Güncelle (Önerilen)

Doğru kullanıcı adını ve şifreyi öğrendikten sonra `backend/.env` dosyasını güncelleyin:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iade_yonetim
DB_USER=BURAYA_GERÇEK_KULLANICI_ADINI_YAZ
DB_PASSWORD=BURAYA_GERÇEK_ŞİFREYİ_YAZ
```

### Adım 3B: Container'ı Yeniden Oluştur (Alternatif)

Eğer container'ı yeniden oluşturmak isterseniz:

```bash
# Eski container'ı durdur ve sil
docker stop iade-postgres
docker rm iade-postgres

# Yeni container oluştur (doğru kullanıcı bilgileri ile)
docker run --name iade-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=iade_yonetim \
  -p 5432:5432 \
  -d postgres:latest

# Container'ın çalıştığını kontrol et
docker ps | grep iade-postgres
```

### Adım 4: Database'i Kur

Backend klasöründe:

```bash
cd ~/Desktop/iade-yonetim/backend

# Database tablolarını oluştur
npm run db:setup
```

### Adım 5: Backend'i Başlat

```bash
npm run dev
```

## 🎯 Hızlı Test

Backend çalıştıktan sonra kayıt olun:

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test123!",
    "name": "Test User",
    "role": "seller"
  }'
```

## 📋 Kontrol Listesi

- [ ] Docker container çalışıyor (`docker ps`)
- [ ] Doğru kullanıcı adını ve şifreyi öğrendim
- [ ] `backend/.env` dosyasını doğru bilgilerle güncelledim
- [ ] Database kuruldu (`npm run db:setup`)
- [ ] Backend çalışıyor (`npm run dev`)
- [ ] Frontend'den giriş yapabiliyorum

## 🆘 Hala Çalışmıyor mu?

Container loglarını kontrol edin:

```bash
docker logs iade-postgres
```

Backend loglarını kontrol edin:

```bash
cd ~/Desktop/iade-yonetim/backend
npm run dev
# Hata mesajlarını okuyun
```

## 💡 En Yaygın Hatalar

1. **Port 5432 başka program tarafından kullanılıyor**
   ```bash
   lsof -i :5432
   # Eğer başka bir PostgreSQL varsa durdur
   ```

2. **Docker Desktop çalışmıyor**
   - Docker Desktop uygulamasını başlatın

3. **Container durdurulmuş**
   ```bash
   docker start iade-postgres
   ```

4. **Firewall sorunu**
   - localhost bağlantısında genellikle sorun olmaz
   - Eğer uzak sunucuya bağlanıyorsanız DB_HOST'u güncelleyin
