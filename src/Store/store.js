// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '../Store/Slices/wishlistSlice.js';

export const store = configureStore({
    reducer: {
        wishlist: wishlistReducer
    }
});