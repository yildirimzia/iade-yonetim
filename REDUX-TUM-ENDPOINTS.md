# Redux Store - Tüm Endpoint'ler

## 📋 Kullanılabilir Redux Slices

Artık tüm API endpoint'leri için Redux state management mevcut:

### ✅ 1. Auth (`/api/auth`)
- `login(credentials)` - Giriş yap
- `register(userData)` - Kayıt ol
- `logout()` - Çıkış yap

### ✅ 2. Products (`/api/products`)
- `fetchProducts({ page, limit })` - Ürünleri listele
- `fetchProductById(id)` - Ürün detayı
- `createProduct(data)` - Yeni ürün
- `updateProduct({ id, data })` - Ürün güncelle
- `deleteProduct(id)` - Ürün sil

### ✅ 3. Users (`/api/users`)
- `fetchUsers({ page, limit })` - Kullanıcıları listele
- `fetchUserById(id)` - Kullanıcı detayı

### ✅ 4. Returns (`/api/returns`) - YENİ! 🎉
- `fetchReturns({ page, limit })` - İadeleri listele
- `fetchReturnById(id)` - İade detayı
- `createReturn(data)` - Yeni iade
- `updateReturn({ id, data })` - İade güncelle
- `deleteReturn(id)` - İade sil

### ✅ 5. Inventory (`/api/inventory`) - YENİ! 🎉
- `fetchInventory({ page, limit })` - Envanteri listele
- `fetchInventoryById(id)` - Envanter detayı
- `createInventoryItem(data)` - Yeni envanter kaydı
- `updateInventoryItem({ id, data })` - Envanter güncelle
- `deleteInventoryItem(id)` - Envanter kaydı sil

### ✅ 6. Shipments (`/api/shipments`) - YENİ! 🎉
- `fetchShipments({ page, limit })` - Kargoları listele
- `fetchShipmentById(id)` - Kargo detayı
- `createShipment(data)` - Yeni kargo
- `updateShipment({ id, data })` - Kargo güncelle
- `deleteShipment(id)` - Kargo sil

---

## 🚀 Hızlı Kullanım

### İadeler (Returns) Kullanımı

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchReturns, createReturn } from '@/store/slices/returnsSlice';

function ReturnsPage() {
  const dispatch = useAppDispatch();
  const returns = useAppSelector((state: any) => state.returns.items);
  const loading = useAppSelector((state: any) => state.returns.loading);
  const error = useAppSelector((state: any) => state.returns.error);

  useEffect(() => {
    dispatch(fetchReturns({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleCreateReturn = async (returnData: any) => {
    const result = await dispatch(createReturn({
      product_id: returnData.productId,
      reason: returnData.reason,
      quantity: returnData.quantity,
      status: 'pending'
    }));

    if (createReturn.fulfilled.match(result)) {
      alert('İade başarıyla oluşturuldu!');
    }
  };

  return (
    <div>
      {loading && <p>Yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}
      {returns.map(ret => (
        <div key={ret.id}>{ret.reason}</div>
      ))}
    </div>
  );
}
```

### Envanter (Inventory) Kullanımı

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchInventory, updateInventoryItem } from '@/store/slices/inventorySlice';

function InventoryPage() {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector((state: any) => state.inventory.items);
  const loading = useAppSelector((state: any) => state.inventory.loading);

  useEffect(() => {
    dispatch(fetchInventory({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleUpdateStock = async (itemId: number, newQuantity: number) => {
    await dispatch(updateInventoryItem({ 
      id: itemId, 
      data: { quantity: newQuantity } 
    }));
  };

  return (
    <div>
      {inventory.map(item => (
        <div key={item.id}>
          <span>{item.location}: {item.quantity} adet</span>
          <button onClick={() => handleUpdateStock(item.id, item.quantity + 10)}>
            +10
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Kargolar (Shipments) Kullanımı

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchShipments, createShipment } from '@/store/slices/shipmentsSlice';

function ShipmentsPage() {
  const dispatch = useAppDispatch();
  const shipments = useAppSelector((state: any) => state.shipments.items);
  const loading = useAppSelector((state: any) => state.shipments.loading);

  useEffect(() => {
    dispatch(fetchShipments({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleCreateShipment = async (data: any) => {
    const result = await dispatch(createShipment({
      product_id: data.productId,
      tracking_number: data.trackingNumber,
      carrier: data.carrier, // 'DHL', 'UPS', 'FedEx', etc.
      status: 'in_transit',
      shipped_at: new Date().toISOString()
    }));

    if (createShipment.fulfilled.match(result)) {
      alert('Kargo başarıyla oluşturuldu!');
    }
  };

  return (
    <div>
      {shipments.map(shipment => (
        <div key={shipment.id}>
          <p>Takip No: {shipment.tracking_number}</p>
          <p>Kargo: {shipment.carrier}</p>
          <p>Durum: {shipment.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 State Yapısı

Tüm slice'lar aynı yapıyı takip eder:

```typescript
{
  items: [],              // Liste verisi
  selectedItem: null,     // Seçili tek kayıt
  loading: false,         // Yükleme durumu
  error: null,           // Hata mesajı
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  }
}
```

---

## 🎯 Store Konfigürasyonu

`src/store/index.ts` içinde tüm reducer'lar tanımlı:

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    users: usersReducer,
    returns: returnsReducer,      // YENİ
    inventory: inventoryReducer,   // YENİ
    shipments: shipmentsReducer,   // YENİ
  },
});
```

---

## ✨ Avantajlar

1. **Merkezi Veri Yönetimi** - Tüm API çağrıları Redux üzerinden
2. **Otomatik Caching** - Tekrar fetch yok
3. **Loading States** - Her slice kendi loading state'ine sahip
4. **Error Handling** - Merkezi hata yönetimi
5. **Type Safety** - TypeScript desteği
6. **DevTools** - Redux DevTools ile debug

---

## 🔥 Sonuç

Artık tüm API endpoint'leri Redux ile yönetiliyor:

- ✅ Authentication
- ✅ Products
- ✅ Users
- ✅ Returns (İadeler)
- ✅ Inventory (Envanter)
- ✅ Shipments (Kargolar)

Tüm CRUD işlemleri Redux thunk'ları ile yapılabilir!
