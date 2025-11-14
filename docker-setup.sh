#!/bin/bash

echo "🐳 Docker PostgreSQL Container Kurulumu Başlıyor..."
echo ""

# Eski container'ı durdur ve sil
echo "📦 Eski container kontrol ediliyor..."
if docker ps -a | grep -q iade-postgres; then
    echo "⚠️  Eski container bulundu, siliniyor..."
    docker stop iade-postgres 2>/dev/null
    docker rm iade-postgres 2>/dev/null
    echo "✅ Eski container silindi"
fi

echo ""
echo "🚀 Yeni PostgreSQL container oluşturuluyor..."
docker run --name iade-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=iade_yonetim \
  -p 5432:5432 \
  -d postgres:latest

if [ $? -eq 0 ]; then
    echo "✅ Container başarıyla oluşturuldu!"
    echo ""
    echo "⏳ PostgreSQL'in hazır olması bekleniyor (5 saniye)..."
    sleep 5

    echo ""
    echo "📊 Container durumu:"
    docker ps | grep iade-postgres

    echo ""
    echo "✅ PostgreSQL hazır!"
    echo ""
    echo "📝 Bağlantı Bilgileri:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: iade_yonetim"
    echo "   User: postgres"
    echo "   Password: postgres"
    echo ""
    echo "🎯 Sırada ne yapmalısınız:"
    echo "   1. cd backend"
    echo "   2. npm run db:setup"
    echo "   3. npm run dev"
    echo ""
else
    echo "❌ Container oluşturulamadı!"
    echo ""
    echo "🔍 Sorun giderme:"
    echo "   - Docker Desktop çalışıyor mu? Kontrol edin"
    echo "   - Port 5432 başka program tarafından kullanılıyor mu?"
    echo "     Kontrol için: lsof -i :5432"
    exit 1
fi
