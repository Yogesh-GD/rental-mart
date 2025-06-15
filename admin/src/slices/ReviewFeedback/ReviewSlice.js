import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const fetchReviewsData = createAsyncThunk("reviews/fetchReviewsData", async (query, {rejectWithValue}) => {
  try {
    const response = await api.get("/admin/get/reviews", { params: query });
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteReview = createAsyncThunk("reviews/delete",async (id, {rejectWithValue}) => {
  try {
    const response = api.delete(`/admin/delete/review/${id}`)
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
})


const addReview = createAsyncThunk("reviews/add",async ({id,review}, {rejectWithValue}) => {
  try {
    const response = api.post(`/user/add/car/${id}/review`,review)
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
})

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews:null,
    pagination:null,
    totalReviews: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewsData.fulfilled, (state, action) => {
        state.loading = false;
        state.totalReviews = action.payload.data.totalReviews;
        state.reviews = action.payload.data.reviews
        state.pagination = action.payload.pagination
      })
      .addCase(fetchReviewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending,(state,action) => {
      })
      .addCase(deleteReview.fulfilled,(state,action) => {
        const deletedReview = action.payload
        state.reviews = state.reviews.filter(review => review._id !== deletedReview._id)
      })
      .addCase(deleteReview.rejected,(state,action) => {
      })
      .addCase(addReview.pending,(state,action) => {
      })
      .addCase(addReview.fulfilled,(state,action) => {
      })
      .addCase(addReview.rejected,(state,action) => {
      })
  },
});

export default reviewSlice.reducer;
