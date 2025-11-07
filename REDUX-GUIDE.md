# Redux Store Kullanım Kılavuzu

## 📦 Kurulum Tamamlandı

Redux Toolkit ve React Redux başarıyla kuruldu ve yapılandırıldı.

## 📂 Yapı

```
src/store/
├── index.ts              # Store konfigürasyonu
├── Provider.tsx          # Redux Provider component
└── slices/
    ├── authSlice.ts      # Authentication state
    ├── productsSlice.ts  # Products state
    └── usersSlice.ts     # Users state
```

## 🎯 Kullanım Örnekleri

### 1. Authentication (Login/Logout)

```typescript
'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { login, logout } from '@/store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await dispatch(login({
      email: 'user@example.com',
      password: 'password123'
    }));
    
    if (login.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div>{error}</div>}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Products (Fetch, Create, Update, Delete)

```typescript
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchProducts, 
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct 
} from '@/store/slices/productsSlice';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error, pagination } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Fetch products on mount
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleCreate = async () => {
    const result = await dispatch(createProduct({
      product_name: 'New Product',
      sku: 'SKU123',
      category: 'Electronics',
      original_price: 100
    }));
    
    if (createProduct.fulfilled.match(result)) {
      console.log('Product created!', result.payload);
    }
  };

  const handleUpdate = async (id: string) => {
    await dispatch(updateProduct({
      id,
      data: { product_name: 'Updated Name' }
    }));
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteProduct(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleCreate}>Add Product</button>
      {items.map((product) => (
        <div key={product.id}>
          <h3>{product.product_name}</h3>
          <button onClick={() => handleUpdate(product.id.toString())}>Edit</button>
          <button onClick={() => handleDelete(product.id.toString())}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### 3. Product Detail Page

```typescript
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProductById } from '@/store/slices/productsSlice';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const { selectedProduct, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(params.id));
  }, [dispatch, params.id]);

  if (loading) return <div>Loading...</div>;
  if (!selectedProduct) return <div>Product not found</div>;

  return (
    <div>
      <h1>{selectedProduct.product_name}</h1>
      <p>{selectedProduct.category}</p>
      <p>{selectedProduct.original_price} ₺</p>
    </div>
  );
}
```

### 4. Users Management

```typescript
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUsers, fetchUserById } from '@/store/slices/usersSlice';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <div>
      {items.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
  );
}
```

### 5. Protected Route with Auth Check

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

## 🎨 Store State Yapısı

### Auth State
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### Products State
```typescript
{
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

### Users State
```typescript
{
  items: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

## 🚀 Avantajlar

✅ **Centralized State** - Tüm global state tek yerde
✅ **Type Safety** - Full TypeScript desteği
✅ **DevTools** - Redux DevTools ile debug
✅ **Predictable** - State değişiklikleri takip edilebilir
✅ **Scalable** - Yeni slice'lar kolayca eklenebilir
✅ **Optimized** - Automatic memoization
✅ **Async Handling** - Built-in async thunks
✅ **Error Handling** - Merkezi hata yönetimi

## 📝 Yeni Slice Ekleme

```typescript
// store/slices/newFeatureSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchData = createAsyncThunk(
  'newFeature/fetchData',
  async (params: any, { rejectWithValue }) => {
    try {
      // API call
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const newFeatureSlice = createSlice({
  name: 'newFeature',
  initialState: { /* ... */ },
  reducers: { /* ... */ },
  extraReducers: (builder) => { /* ... */ }
});

export default newFeatureSlice.reducer;
```

```typescript
// store/index.ts
import newFeatureReducer from './slices/newFeatureSlice';

export const store = configureStore({
  reducer: {
    // ...existing reducers
    newFeature: newFeatureReducer,
  },
});
```

## 🔧 Redux DevTools

Chrome/Firefox Extension: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)

- State değişikliklerini görselleştir
- Time-travel debugging
- Action history
- State diff

## 📚 Daha Fazla Bilgi

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux Best Practices](https://redux.js.org/style-guide/)
