#!/bin/bash

# İade Yönetim Sistemi API Test Scripti
# Port'u düzenleyin (5000 veya 5001)
PORT=5001
BASE_URL="http://localhost:$PORT"

echo "🚀 İade Yönetim API Test"
echo "========================"
echo ""

# 1. Health Check
echo "1️⃣  Health Check..."
curl -s "$BASE_URL/health" | jq
echo ""

# 2. Login ve Token Al
echo "2️⃣  Admin Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iadeyonetim.com","password":"Admin123!"}')

echo "$LOGIN_RESPONSE" | jq
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Token alınamadı!"
    exit 1
fi

echo ""
echo "✅ Token alındı!"
echo ""

# 3. Users Listesi
echo "3️⃣  Kullanıcı Listesi..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/users" | jq
echo ""

# 4. User Stats
echo "4️⃣  Kullanıcı İstatistikleri..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/users/stats" | jq
echo ""

# 5. Products
echo "5️⃣  Ürün Listesi..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/products" | jq
echo ""

# 6. Returns Stats
echo "6️⃣  İade İstatistikleri..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/returns/stats" | jq
echo ""

# 7. Shipments Stats
echo "7️⃣  Kargo İstatistikleri..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/shipments/stats" | jq
echo ""

echo "✅ Tüm testler tamamlandı!"
