# ✓ KURULUM KONTROL LİSTESİ

Projeyi kurarken bu adımları takip edin:

## ☐ 1. Gereksinimler

- [ ] Node.js v18+ kurulu mu? → `node --version`
- [ ] npm kurulu mu? → `npm --version`
- [ ] PostgreSQL v14+ kurulu mu? → `psql --version`
- [ ] PostgreSQL çalışıyor mu? → Servisi kontrol edin

## ☐ 2. Backend Kurulumu

- [ ] `cd backend` klasörüne gidin
- [ ] `npm install` çalıştırın
- [ ] `.env.example` dosyasını `.env` olarak kopyalayın
- [ ] `.env` dosyasını açın ve düzenleyin:
  - [ ] `DB_PASSWORD` PostgreSQL şifrenizi yazın
  - [ ] `JWT_SECRET` güvenli bir anahtar oluşturun
- [ ] `npm run db:setup` ile veritabanını kurun
- [ ] Terminal çıktısında ✅ işaretlerini görün
- [ ] `npm run dev` ile backend'i başlatın
- [ ] "Server çalışıyor" mesajını görün

**Başarılı ise:** http://localhost:5000 açıldığında JSON response göreceksiniz

## ☐ 3. Frontend Kurulumu

- [ ] Yeni bir terminal açın
- [ ] `cd frontend` klasörüne gidin
- [ ] `npm install` çalıştırın
- [ ] `.env.local.example` dosyasını `.env.local` olarak kopyalayın
- [ ] `npm run dev` ile frontend'i başlatın
- [ ] "Ready" mesajını görün

**Başarılı ise:** http://localhost:3000 açıldığında login sayfası görünecek

## ☐ 4. İlk Giriş Testi

- [ ] http://localhost:3000 adresine gidin
- [ ] Login sayfası yüklendi mi?
- [ ] Demo admin bilgileriyle giriş yapın:
  - Email: `admin@iadeyonetim.com`
  - Şifre: `Admin123!`
- [ ] Dashboard sayfası açıldı mı?
- [ ] İstatistikler görünüyor mu?

## ☐ 5. API Testi (Opsiyonel)

Postman veya curl ile test edin:

```bash
# Health check
curl http://localhost:5000/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iadeyonetim.com","password":"Admin123!"}'
```

## 📋 Sorun Giderme

### Backend başlamıyor:
- [ ] PostgreSQL çalışıyor mu kontrol edin
- [ ] Port 5000 kullanımda mı kontrol edin: `lsof -i :5000` (Mac/Linux)
- [ ] `.env` dosyası doğru mu kontrol edin
- [ ] Veritabanı şifresi doğru mu kontrol edin

### Frontend başlamıyor:
- [ ] Backend çalışıyor mu kontrol edin
- [ ] Port 3000 kullanımda mı kontrol edin
- [ ] `.env.local` dosyası var mı kontrol edin
- [ ] `node_modules` klasörünü silin ve `npm install` tekrar çalıştırın

### Giriş yapamıyorum:
- [ ] Backend çalışıyor mu kontrol edin
- [ ] Veritabanı kurulumu başarılı oldu mu kontrol edin
- [ ] Backend terminal'de hata var mı kontrol edin
- [ ] Browser console'da hata var mı kontrol edin (F12)

### Veritabanı hatası:
- [ ] PostgreSQL servisi başlatın
- [ ] Veritabanı kullanıcısı ve şifresi doğru mu kontrol edin
- [ ] `npm run db:setup` komutunu tekrar çalıştırın

## ✅ Her Şey Çalışıyor!

Eğer tüm adımlar başarılıysa:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000
- ✅ Login yapabiliyorsunuz
- ✅ Dashboard görüntüleniyor

## 🎯 Sonraki Adımlar

1. **Admin şifresini değiştirin:**
   - Dashboard → Profil → Şifre Değiştir

2. **İlk satıcıyı ekleyin:**
   - Logout yapın
   - "Kayıt Ol" butonuna tıklayın
   - Satıcı bilgilerini girin

3. **Test edin:**
   - Ürün ekleyin
   - İade ekleyin (admin olarak)
   - Kargo oluşturun

4. **Geliştirmeye başlayın:**
   - Frontend sayfalarını tamamlayın
   - Özellikler ekleyin
   - UI/UX iyileştirin

## 📞 Yardım

Tüm adımları takip ettiniz ama hala sorun mu var?

1. Terminal loglarını kontrol edin
2. Browser console'u kontrol edin (F12)
3. `HIZLI-BASLANGIC.md` dökümanını okuyun
4. `README.md` detaylı bilgiler için

---

**İyi Çalışmalar! 🚀**
