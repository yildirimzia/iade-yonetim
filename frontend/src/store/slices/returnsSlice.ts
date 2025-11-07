import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Return {
  id: number;
  product_id: number;
  user_id: number;
  reason: string;
  status: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface ReturnsState {
  items: Return[];
  selectedReturn: Return | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: ReturnsState = {
  items: [],
  selectedReturn: null,
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
export const fetchReturns = createAsyncThunk(
  'returns/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns?page=${page}&limit=${limit}`,
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
      return rejectWithValue('Failed to fetch returns');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch returns');
    }
  }
);

export const fetchReturnById = createAsyncThunk(
  'returns/fetchById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns/${id}`,
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
      return rejectWithValue('Failed to fetch return');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch return');
    }
  }
);

export const createReturn = createAsyncThunk(
  'returns/create',
  async (returnData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(returnData),
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue('Failed to create return');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create return');
    }
  }
);

export const updateReturn = createAsyncThunk(
  'returns/update',
  async ({ id, data: returnData }: { id: string | number; data: any }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(returnData),
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue('Failed to update return');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update return');
    }
  }
);

export const deleteReturn = createAsyncThunk(
  'returns/delete',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns/${id}`,
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
      return rejectWithValue('Failed to delete return');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete return');
    }
  }
);

// Slice
const returnsSlice = createSlice({
  name: 'returns',
  initialState,
  reducers: {
    setSelectedReturn: (state, action: PayloadAction<Return | null>) => {
      state.selectedReturn = action.payload;
    },
    clearSelectedReturn: (state) => {
      state.selectedReturn = null;
    },
    clearReturns: (state) => {
      state.items = [];
      state.selectedReturn = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all returns
    builder.addCase(fetchReturns.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReturns.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchReturns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch return by ID
    builder.addCase(fetchReturnById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReturnById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedReturn = action.payload;
    });
    builder.addCase(fetchReturnById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create return
    builder.addCase(createReturn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createReturn.fulfilled, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
    });
    builder.addCase(createReturn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update return
    builder.addCase(updateReturn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateReturn.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedReturn?.id === action.payload.id) {
        state.selectedReturn = action.payload;
      }
    });
    builder.addCase(updateReturn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete return
    builder.addCase(deleteReturn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteReturn.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((r) => String(r.id) !== String(action.payload));
      if (state.selectedReturn && String(state.selectedReturn.id) === String(action.payload)) {
        state.selectedReturn = null;
      }
    });
    builder.addCase(deleteReturn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedReturn, clearSelectedReturn, clearReturns } = returnsSlice.actions;
export default returnsSlice.reducer;
