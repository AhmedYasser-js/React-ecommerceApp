// src/redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { token } : {};
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
                headers
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.post(
                'https://ecommerce.routemisr.com/api/v1/wishlist',
                { productId },
                { headers }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const headers = getAuthHeaders();
            const response = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers }
            );
            return { ...response.data, productId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        count: 0,
        loading: false,
        error: null
    },
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.count = 0;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data || [];
                state.count = action.payload.count || action.payload.data?.length || 0;
                state.error = null;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add to Wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.data || [];
                state.count = action.payload.data?.length || state.count + 1;
                state.error = null;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Remove from Wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.count = Math.max(state.count - 1, 0);
                state.items = state.items.filter(item => item._id !== action.payload.productId);
                state.error = null;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearWishlist, clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;