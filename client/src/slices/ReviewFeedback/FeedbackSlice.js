import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const getFeedbacks = createAsyncThunk("feedback/fetchReviewsData", async (query, {rejectWithValue}) => {
  try {
    const response = await api.get("/admin/get/feedbacks",{params:query});
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const deleteFeedback = createAsyncThunk("feedback/delete", async (id, {rejectWithValue}) => {
    try {
      const response = await api.delete(`/admin/delete/feedback/${id}`);
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });


  export const addFeedbackByUser = createAsyncThunk("feedback/add/user", async ({carId,formData}, {rejectWithValue}) => {
    try {
      const response = await api.post(`/user/add/feedback?carId=${carId ? carId :"" }`,formData,{
            headers: {
                'Content-Type': 'application/json',
              },
        });
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  
  
  export const addFeedback = createAsyncThunk("feedback/add", async ({carId,formData}, {rejectWithValue}) => {
    try {
      const response = await api.post(`/api/v1/add/feedback?carId=${carId ? carId :"" }`,formData,{
            headers: {
                'Content-Type': 'application/json',
              },
        });
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    totalFeedbacks:0,
    feedbacks:null,
    pagination:null,
    status:"idle",
    loading: false,
    error: null,
    formError:null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.totalFeedbacks = action.payload.data.totalReviews;
        state.pagination = action.payload.pagination
        state.feedbacks = action.payload.data.feedbacks
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFeedback.pending, (state) => {
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        const deletedFeedback = action.payload
        state.feedbacks = state.feedbacks.filter(feedback => feedback._id !== deletedFeedback._id)
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
      })
      .addCase(addFeedback.pending, (state) => {
        state.status = "submitting"
        state.formError = null
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.status = "succeed"
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.status = "failed"
        state.formError = action.payload
      })
      .addCase(addFeedbackByUser.pending, (state) => {
        state.status = "submitting"
        state.formError = null
      })
      .addCase(addFeedbackByUser.fulfilled, (state, action) => {
        state.status = "succeed"
      })
      .addCase(addFeedbackByUser.rejected, (state, action) => {
        state.status = "failed"
        state.formError = action.payload
      });
  },
});

export default feedbackSlice.reducer;
