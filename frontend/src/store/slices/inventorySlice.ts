import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface InventoryItem {
  id: number;
  product_id: number;
  quantity: number;
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: InventoryState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

// Async thunks
export const fetchInventory = createAsyncThunk(
  'inventory/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        return {
          items: data.data,
          pagination: data.pagination || { total: data.data.length, page, limit, pages: 1 },
        };
      }
      return rejectWithValue('Failed to fetch inventory');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch inventory');
    }
  }
);

export const fetchInventoryById = createAsyncThunk(
  'inventory/fetchById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue('Failed to fetch inventory item');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch inventory item');
    }
  }
);

export const createInventoryItem = createAsyncThunk(
  'inventory/create',
  async (itemData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue('Failed to create inventory item');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create inventory item');
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/update',
  async ({ id, data: itemData }: { id: string | number; data: any }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue('Failed to update inventory item');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update inventory item');
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'inventory/delete',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        return id;
      }
      return rejectWithValue('Failed to delete inventory item');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete inventory item');
    }
  }
);

// Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    clearInventory: (state) => {
      state.items = [];
      state.selectedItem = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all inventory
    builder.addCase(fetchInventory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInventory.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchInventory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch inventory item by ID
    builder.addCase(fetchInventoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInventoryById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedItem = action.payload;
    });
    builder.addCase(fetchInventoryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create inventory item
    builder.addCase(createInventoryItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createInventoryItem.fulfilled, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
    });
    builder.addCase(createInventoryItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update inventory item
    builder.addCase(updateInventoryItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateInventoryItem.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedItem?.id === action.payload.id) {
        state.selectedItem = action.payload;
      }
    });
    builder.addCase(updateInventoryItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete inventory item
    builder.addCase(deleteInventoryItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteInventoryItem.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => String(item.id) !== String(action.payload));
      if (state.selectedItem && String(state.selectedItem.id) === String(action.payload)) {
        state.selectedItem = null;
      }
    });
    builder.addCase(deleteInventoryItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedItem, clearSelectedItem, clearInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
