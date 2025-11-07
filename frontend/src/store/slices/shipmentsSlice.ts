import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Shipment {
  id: number;
  product_id: number;
  user_id: number;
  tracking_number: string;
  carrier: string;
  status: string;
  shipped_at: string;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ShipmentsState {
  items: Shipment[];
  selectedShipment: Shipment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: ShipmentsState = {
  items: [],
  selectedShipment: null,
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
export const fetchShipments = createAsyncThunk(
  'shipments/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments?page=${page}&limit=${limit}`,
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
      return rejectWithValue('Failed to fetch shipments');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shipments');
    }
  }
);

export const fetchShipmentById = createAsyncThunk(
  'shipments/fetchById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${id}`,
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
      return rejectWithValue('Failed to fetch shipment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shipment');
    }
  }
);

export const createShipment = createAsyncThunk(
  'shipments/create',
  async (shipmentData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shipmentData),
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue('Failed to create shipment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create shipment');
    }
  }
);

export const updateShipment = createAsyncThunk(
  'shipments/update',
  async ({ id, data: shipmentData }: { id: string | number; data: any }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shipmentData),
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return rejectWithValue('Failed to update shipment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update shipment');
    }
  }
);

export const deleteShipment = createAsyncThunk(
  'shipments/delete',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${id}`,
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
      return rejectWithValue('Failed to delete shipment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete shipment');
    }
  }
);

// Slice
const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    setSelectedShipment: (state, action: PayloadAction<Shipment | null>) => {
      state.selectedShipment = action.payload;
    },
    clearSelectedShipment: (state) => {
      state.selectedShipment = null;
    },
    clearShipments: (state) => {
      state.items = [];
      state.selectedShipment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all shipments
    builder.addCase(fetchShipments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchShipments.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchShipments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch shipment by ID
    builder.addCase(fetchShipmentById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchShipmentById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedShipment = action.payload;
    });
    builder.addCase(fetchShipmentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create shipment
    builder.addCase(createShipment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createShipment.fulfilled, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
    });
    builder.addCase(createShipment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update shipment
    builder.addCase(updateShipment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateShipment.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedShipment?.id === action.payload.id) {
        state.selectedShipment = action.payload;
      }
    });
    builder.addCase(updateShipment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete shipment
    builder.addCase(deleteShipment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteShipment.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((s) => String(s.id) !== String(action.payload));
      if (state.selectedShipment && String(state.selectedShipment.id) === String(action.payload)) {
        state.selectedShipment = null;
      }
    });
    builder.addCase(deleteShipment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedShipment, clearSelectedShipment, clearShipments } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
