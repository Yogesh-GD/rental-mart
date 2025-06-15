import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const fetchWishlistsData = createAsyncThunk("wishlists/fetchWishlistsData", async (_, {rejectWithValue}) => {
  try {
    const response = await api.get("/admin/dashboard");
    return {
      totalWishlists: response.data.totalWishlists
    };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});



export const addToWishlist = createAsyncThunk("wishlists/add", async (id,{rejectWithValue}) => {
  try {
    const response = await api.put(`/user/add/to/wishlist/${id}`)
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const removeToWishlist = createAsyncThunk("wishlists/remove", async (id,{rejectWithValue}) => {
  try {
    const response = await api.put(`/user/remove/from/wishlist/${id}`)
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getUserWishlist = createAsyncThunk("wishlists/get/user", async (_,{rejectWithValue}) => {
  try {
    const response = await api.get("/user/get/wishlist")
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

const wishlistSlice = createSlice({
  name: "wishlists",
  initialState: {
    totalWishlists: 0,
    wishlists:null,
    loading: false,
    error: null,
    status:"idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistsData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalWishlists = action.payload.totalWishlists;
      })
      .addCase(fetchWishlistsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending,(state,action) => {
        state.status = "adding"
      })
      .addCase(addToWishlist.fulfilled,(state,action) => {
        state.wishlists = action.payload
        state.status = "added"
      })
      .addCase(addToWishlist.rejected,(state,action) => {
        state.status = "failed"
      })
      .addCase(removeToWishlist.pending,(state,action) => {
        state.status = "removing"
      })
      .addCase(removeToWishlist.fulfilled,(state,action) => {
        state.status = "removed"
        state.wishlists = action.payload
      })
      .addCase(removeToWishlist.rejected,(state,action) => {
        state.status = "failed"
      })
      .addCase(getUserWishlist.pending,(state,action) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserWishlist.fulfilled,(state,action) => {
        state.loading = false
        state.wishlists = action.payload
      })
      .addCase(getUserWishlist.rejected,(state,action) => {
        state.loading = false
        state.error = action.payload
      })
  },
});

export default wishlistSlice.reducer;
