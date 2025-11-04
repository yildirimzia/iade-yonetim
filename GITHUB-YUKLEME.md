# 📤 GitHub'a Yükleme Rehberi

## Yöntem 1: Komut Satırı (Terminal) - Önerilen

### Adım 1: GitHub'da Yeni Repository Oluşturun
1. https://github.com/new adresine gidin
2. Repository adı: `iade-yonetim-sistemi` (veya istediğiniz ad)
3. Description: "Bulgaristan merkezli iade yönetim platformu"
4. Public veya Private seçin
5. ⚠️ **README, .gitignore veya license EKLEMEYIN** (zaten hazır)
6. "Create repository" butonuna tıklayın

### Adım 2: Projeyi Bilgisayarınıza İndirin
Outputs klasöründeki tüm dosyaları bilgisayarınıza indirin.

### Adım 3: Terminal'de Git Komutlarını Çalıştırın

```bash
# 1. İndirdiğiniz klasöre gidin
cd /path/to/iade-yonetim-sistemi

# 2. Git repository'sini başlatın
git init

# 3. Tüm dosyaları ekleyin
git add .

# 4. İlk commit'i yapın
git commit -m "İlk commit: İade Yönetim Sistemi v1.0"

# 5. Ana branch'i oluşturun
git branch -M main

# 6. GitHub repository'nizi ekleyin (KULLANICI-ADINIZ'ı değiştirin!)
git remote add origin https://github.com/KULLANICI-ADINIZ/iade-yonetim-sistemi.git

# 7. Kodu GitHub'a gönderin
git push -u origin main
```

### Adım 4: GitHub Token Gerekiyorsa
Şifre yerine Personal Access Token kullanmanız istenebilir:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Scope: `repo` seçin
4. Token'ı kopyalayın
5. Push yaparken şifre yerine bu token'ı kullanın

---

## Yöntem 2: GitHub Desktop - En Kolay

### Adım 1: GitHub Desktop'u İndirin
https://desktop.github.com/

### Adım 2: Repository Oluşturun
1. GitHub Desktop'u açın
2. File → New Repository
3. Name: `iade-yonetim-sistemi`
4. Local Path: İndirdiğiniz klasörü seçin
5. "Create Repository"

### Adım 3: Dosyaları Ekleyin
1. Tüm dosyaları proje klasörüne kopyalayın
2. GitHub Desktop otomatik algılayacak
3. Commit message: "İlk commit: İade Yönetim Sistemi"
4. "Commit to main"

### Adım 4: GitHub'a Yükleyin
1. "Publish repository"
2. Public/Private seçin
3. "Publish repository"

---

## Yöntem 3: GitHub Web UI - Hızlı Ama Sınırlı

### Sadece Küçük Projeler İçin
⚠️ Bu yöntem çok fazla dosya yüklemek için ideal değil

1. GitHub'da repository oluşturun
2. "uploading an existing file" linkine tıklayın
3. Dosyaları sürükleyip bırakın
4. Commit message yazın
5. "Commit changes"

---

## 🔧 İlk Push Sonrası

### README'yi Düzenleyin
```bash
# README-EN.md'deki YOUR-USERNAME kısmını değiştirin
# Sonra:
git add README-EN.md
git commit -m "README güncellendi"
git push
```

### Branch Stratejisi (Opsiyonel)
```bash
# Geliştirme branch'i oluşturun
git checkout -b development
git push -u origin development

# Feature branch'leri için:
git checkout -b feature/yeni-ozellik
```

### .gitignore Kontrolü
Hassas bilgilerin yüklenmediğinden emin olun:
```bash
# Bu dosyalar yüklenmemeli:
# - .env
# - node_modules/
# - .env.local
```

---

## 🎯 GitHub Repository Ayarları

### Repository Oluşturduktan Sonra:

1. **About Bölümü** (sağ üst)
   - Description: "Bulgaristan merkezli iade ve kargo yönetim platformu"
   - Website: Demo URL'iniz varsa
   - Topics ekleyin: `nodejs`, `nextjs`, `postgresql`, `inventory-management`

2. **README Badge'leri** (Opsiyonel)
   ```markdown
   ![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
   ![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14-blue)
   ![Next.js](https://img.shields.io/badge/next.js-14-black)
   ```

3. **LICENSE Dosyası**
   - Add file → Create new file
   - Dosya adı: `LICENSE`
   - Template: MIT License seçin

4. **Issues Template** (Opsiyonel)
   Settings → Features → Issues → Set up templates

---

## 🚀 Otomatik Push Scripti (İleri Seviye)

`push.sh` dosyası oluşturun:

```bash
#!/bin/bash

echo "🚀 GitHub'a yükleniyor..."

git add .
echo "📝 Commit mesajı girin:"
read commit_message

git commit -m "$commit_message"
git push origin main

echo "✅ Başarıyla yüklendi!"
```

Kullanım:
```bash
chmod +x push.sh
./push.sh
```

---

## ❗ Sık Karşılaşılan Hatalar

### Hata 1: "Permission denied"
**Çözüm:** SSH key ekleyin veya Personal Access Token kullanın

### Hata 2: "Repository not found"
**Çözüm:** Remote URL'i kontrol edin:
```bash
git remote -v
git remote set-url origin https://github.com/DOGRU-KULLANICI/DOGRU-REPO.git
```

### Hata 3: "Large files"
**Çözüm:** Git LFS kullanın veya .gitignore'a ekleyin

### Hata 4: "Merge conflicts"
**Çözüm:**
```bash
git pull origin main --rebase
# Çakışmaları çözün
git add .
git rebase --continue
git push
```

---

## 📞 Yardım

- Git öğrenmek için: https://learngitbranching.js.org/
- GitHub Docs: https://docs.github.com/
- Git komutları: https://git-scm.com/docs

---

**İyi Çalışmalar! 🎉**
