#!/bin/bash

echo "🚀 İade Yönetim Sistemi - Tam Kurulum"
echo "======================================"
echo ""

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Adım 1: Docker PostgreSQL
echo "📦 Adım 1: Docker PostgreSQL Kontrolü"
echo "--------------------------------------"
if docker ps | grep -q iade-postgres; then
    echo -e "${GREEN}✅ PostgreSQL container zaten çalışıyor${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL container çalışmıyor${NC}"
    echo "Docker container'ı başlatmak için şu komutları çalıştırın:"
    echo ""
    echo "  ./docker-setup.sh"
    echo ""
    echo "veya manuel olarak:"
    echo ""
    echo "  docker start iade-postgres"
    echo ""
    echo "Eğer container hiç yoksa oluşturun:"
    echo ""
    echo "  docker run --name iade-postgres \\"
    echo "    -e POSTGRES_USER=postgres \\"
    echo "    -e POSTGRES_PASSWORD=postgres \\"
    echo "    -e POSTGRES_DB=iade_yonetim \\"
    echo "    -p 5432:5432 \\"
    echo "    -d postgres:latest"
    echo ""
    read -p "Docker container'ı başlatıp Enter'a basın..."
fi

# PostgreSQL hazır olana kadar bekle
echo ""
echo "⏳ PostgreSQL'in hazır olması bekleniyor..."
sleep 3

# Adım 2: Backend .env kontrolü
echo ""
echo "📝 Adım 2: Backend .env Kontrolü"
echo "--------------------------------------"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ backend/.env dosyası mevcut${NC}"
    echo "İçerik:"
    cat backend/.env | grep -E "PORT|DB_"
else
    echo -e "${RED}❌ backend/.env dosyası bulunamadı!${NC}"
    echo "Dosya oluşturuluyor..."
    cat > backend/.env << 'EOL'
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iade_yonetim
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000
EOL
    echo -e "${GREEN}✅ backend/.env oluşturuldu${NC}"
fi

# Adım 3: Backend node_modules kontrolü
echo ""
echo "📦 Adım 3: Backend Dependencies"
echo "--------------------------------------"
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies kurulu${NC}"
else
    echo -e "${YELLOW}⚠️  Backend dependencies kuruluyor...${NC}"
    cd backend && npm install && cd ..
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend dependencies kuruldu${NC}"
    else
        echo -e "${RED}❌ Backend dependencies kurulurken hata oluştu${NC}"
        exit 1
    fi
fi

# Adım 4: Database Setup
echo ""
echo "🗄️  Adım 4: Database Setup"
echo "--------------------------------------"
echo "Database tablolarını oluşturuyoruz..."
cd backend
npm run db:setup
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database kuruldu${NC}"
else
    echo -e "${RED}❌ Database kurulurken hata oluştu${NC}"
    echo ""
    echo "Hata detayları yukarıda görünüyor."
    echo "Docker PostgreSQL çalışıyor mu kontrol edin:"
    echo "  docker ps | grep iade-postgres"
    echo ""
    echo "Container loglarını kontrol edin:"
    echo "  docker logs iade-postgres"
    exit 1
fi
cd ..

# Adım 5: Frontend .env.local kontrolü
echo ""
echo "📝 Adım 5: Frontend .env.local Kontrolü"
echo "--------------------------------------"
if [ -f "frontend/.env.local" ]; then
    echo -e "${GREEN}✅ frontend/.env.local dosyası mevcut${NC}"
    cat frontend/.env.local
else
    echo -e "${YELLOW}⚠️  frontend/.env.local oluşturuluyor...${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > frontend/.env.local
    echo -e "${GREEN}✅ frontend/.env.local oluşturuldu${NC}"
fi

# Adım 6: Frontend node_modules kontrolü
echo ""
echo "📦 Adım 6: Frontend Dependencies"
echo "--------------------------------------"
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies kurulu${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dependencies kuruluyor...${NC}"
    cd frontend && npm install && cd ..
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend dependencies kuruldu${NC}"
    else
        echo -e "${RED}❌ Frontend dependencies kurulurken hata oluştu${NC}"
        exit 1
    fi
fi

# Başarı mesajı
echo ""
echo -e "${GREEN}======================================"
echo "✅ Kurulum Tamamlandı!"
echo "======================================${NC}"
echo ""
echo "🎯 Şimdi ne yapmalısınız:"
echo ""
echo "1️⃣  Backend'i başlatın:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2️⃣  Yeni bir terminal açıp Frontend'i başlatın:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3️⃣  Tarayıcıda açın:"
echo "   http://localhost:3000"
echo ""
echo "4️⃣  Default admin ile giriş yapın:"
echo "   Email: admin@iadeyonetim.com"
echo "   Şifre: Admin123!"
echo ""
echo "======================================"
