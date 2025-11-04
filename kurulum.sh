#!/bin/bash

echo "🚀 İade Yönetim Sistemi - Hızlı Kurulum"
echo "========================================"
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend kurulumu
echo -e "${BLUE}📦 Backend kurulumu başlatılıyor...${NC}"
cd backend

# .env dosyası oluştur
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️  .env dosyası oluşturuluyor...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env dosyası oluşturuldu. Lütfen veritabanı bilgilerinizi düzenleyin!${NC}"
else
    echo -e "${GREEN}✅ .env dosyası zaten mevcut${NC}"
fi

# Node modules yükle
echo -e "${BLUE}📥 Backend dependencies yükleniyor...${NC}"
npm install

echo -e "${GREEN}✅ Backend kurulumu tamamlandı!${NC}"
echo ""

# Frontend kurulumu
echo -e "${BLUE}📦 Frontend kurulumu başlatılıyor...${NC}"
cd ../frontend

# .env.local dosyası oluştur
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚙️  .env.local dosyası oluşturuluyor...${NC}"
    cp .env.local.example .env.local
    echo -e "${GREEN}✅ .env.local dosyası oluşturuldu${NC}"
else
    echo -e "${GREEN}✅ .env.local dosyası zaten mevcut${NC}"
fi

# Node modules yükle
echo -e "${BLUE}📥 Frontend dependencies yükleniyor...${NC}"
npm install

echo -e "${GREEN}✅ Frontend kurulumu tamamlandı!${NC}"
echo ""

cd ..

# Tamamlandı mesajı
echo ""
echo -e "${GREEN}🎉 Kurulum tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📝 Sonraki Adımlar:${NC}"
echo ""
echo "1. PostgreSQL'i başlatın"
echo ""
echo "2. backend/.env dosyasını düzenleyin:"
echo "   - DB_PASSWORD: PostgreSQL şifrenizi girin"
echo "   - JWT_SECRET: Güvenli bir secret key belirleyin"
echo ""
echo "3. Veritabanını oluşturun:"
echo -e "   ${BLUE}cd backend && npm run db:setup${NC}"
echo ""
echo "4. Backend'i başlatın (yeni terminal):"
echo -e "   ${BLUE}cd backend && npm run dev${NC}"
echo ""
echo "5. Frontend'i başlatın (başka bir terminal):"
echo -e "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "6. Tarayıcınızda açın:"
echo -e "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "İlk admin girişi:"
echo "   Email: admin@iadeyonetim.com"
echo "   Şifre: Admin123!"
echo ""
echo -e "${YELLOW}⚠️  Üretim ortamında admin şifresini mutlaka değiştirin!${NC}"
echo ""
