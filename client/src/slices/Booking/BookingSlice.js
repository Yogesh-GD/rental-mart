import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const bookVehicle = createAsyncThunk("bookings/book/vehicle", async ({id,credentials}, { rejectWithValue }) => {
  try {

    const response = await api.post(`/user/book/vehicle/${id}`,credentials,{
      headers: {
          'Content-Type': 'application/json',
        },
  });
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchBookingsData = createAsyncThunk("bookings/fetchBookingsData", async (query, { rejectWithValue }) => {
  try {
    const queryString = new URLSearchParams(query).toString();

    const response = await api.get(`/admin/get/bookings?${queryString}`);
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const cancelBooking = createAsyncThunk("bookings/cancel", async ({id,reason}, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/bookings/${id}/cancel`, { reason });
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})




export const getBookingDetails =  createAsyncThunk("bookings/details", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/admin/get/booking/details/${id}`)
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateBookingByAdmin =  createAsyncThunk("bookings/update", async ({id,updatedData}, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/update/booking/${id}`,updatedData,{
      headers: {
          'Content-Type': 'application/json',
        },
  })
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})


//user

export const getUserBookings = createAsyncThunk("/bookings/user", async (__dirname, { rejectWithValue }) => {
  try {
    const response = await api.post("/user/bookings")
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const userCancleBooking = createAsyncThunk("bookings/user/cancel", async ({id,reason = null}, { rejectWithValue }) => {
  try {
    const response = await api.put(`/user/bookings/${id}/cancel`, { reason });
    return response.data.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})



const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    totalBookings: 0,
    details:null,
    bookingDetails:null,
    revenueData: {},
    bookings: [],
    pagination: null,
    loading: false,
    error: null,
    formError:null,
    status:"idle"
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingsData.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload.pagination
        state.totalBookings = action.payload.data.totalBookings;
        state.revenueData = action.payload.data.revenueData;
        state.bookings = action.payload.data.bookings;
      })
      .addCase(fetchBookingsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserBookings.pending, (state, action) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.bookings = action.payload
        state.loading = false
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(getBookingDetails.pending, (state, action) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.details = action.payload
        state.loading = false
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(cancelBooking.pending, (state, action) => {
        state.formError = null
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.details = action.payload
        state.loading = false
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.formError = action.payload
        state.loading = false
      })
      .addCase(updateBookingByAdmin.pending, (state, action) => {
        state.formError = null
        state.status = "submitting"
      })
      .addCase(updateBookingByAdmin.fulfilled, (state, action) => {
        state.details = action.payload
        state.status = "succeed"

      })
      .addCase(updateBookingByAdmin.rejected, (state, action) => {
        state.formError = action.payload
        state.loading = false
        state.status = "failed"

      })
      .addCase(bookVehicle.pending,(state,action) => {
        state.formError = null
        state.status = "submitting"
      })
      .addCase(bookVehicle.fulfilled,(state,action) => {
        state.formError = null
        state.status = "succeed"
        state.bookingDetails = action.payload
      })
      .addCase(bookVehicle.rejected,(state,action) => {
        state.formError = action.payload
        state.status = "failed"
      })
      .addCase(userCancleBooking.pending)
      .addCase(userCancleBooking.fulfilled)
      .addCase(userCancleBooking.rejected)
  },
});
  
export default bookingSlice.reducer;
