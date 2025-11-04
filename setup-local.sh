#!/bin/bash

echo "🚀 İade Yönetim Sistemi - Local Kurulum"
echo "========================================"
echo ""

# Repository klonla veya güncelle
if [ -d "iade-yonetim" ]; then
    echo "📁 Klasör mevcut, güncelleniyor..."
    cd iade-yonetim
    git pull origin claude/project-analysis-011CUoNT5B53Gfb4bVTPZo5J
else
    echo "📥 Repository klonlanıyor..."
    git clone https://github.com/yildirimzia/iade-yonetim.git
    cd iade-yonetim
    git checkout claude/project-analysis-011CUoNT5B53Gfb4bVTPZo5J
fi

echo ""
echo "📦 Backend kurulumu..."
cd backend
npm install

if [ ! -f .env ]; then
    echo "⚙️  .env dosyası oluşturuluyor..."
    cp .env.example .env
    echo "⚠️  .env dosyasını düzenleyin!"
else
    echo "✅ .env dosyası mevcut"
fi

echo ""
echo "📦 Frontend kurulumu..."
cd ../frontend
npm install

if [ ! -f .env.local ]; then
    echo "⚙️  .env.local dosyası oluşturuluyor..."
    cp .env.local.example .env.local
    echo "✅ .env.local oluşturuldu"
else
    echo "✅ .env.local dosyası mevcut"
fi

echo ""
echo "🎉 Kurulum tamamlandı!"
echo ""
echo "📝 Sonraki adımlar:"
echo "   1. backend/.env dosyasını düzenleyin (PostgreSQL bilgileri)"
echo "   2. cd backend && npm run db:setup"
echo "   3. Terminal 1: cd backend && npm run dev"
echo "   4. Terminal 2: cd frontend && npm run dev"
echo "   5. Tarayıcı: http://localhost:3000"
echo ""
