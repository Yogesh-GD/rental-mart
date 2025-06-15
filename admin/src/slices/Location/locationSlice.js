import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const getLocations = createAsyncThunk("locaion/get/locations", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/api/v1/get/locations")
        return response.data.data
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})

export const addLocation = createAsyncThunk("location/addLocation", async (locationData, { rejectWithValue }) => {
    try {
        const response = await api.post("/admin/add/location", locationData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add location.");
    }
});

export const deleteLocation = createAsyncThunk("location/deleteLocation", async (id, { rejectWithValue }) => {
    try {
       await api.delete(`/admin/delete/location/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete location.");
    }
  });

const locationSlice = createSlice({
    name: "location",
    initialState: {
        locations: null,
        loading: null,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLocations.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(getLocations.fulfilled, (state, action) => {
                state.loading = false
                state.locations = action.payload
                state.error = null
            })
            .addCase(getLocations.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(addLocation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addLocation.fulfilled, (state) => { state.loading = false; })
            .addCase(addLocation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(deleteLocation.fulfilled, (state, action) => {
                state.locations = state.locations.filter((location) => location._id !== action.payload);
            })
            .addCase(deleteLocation.rejected, (state, action) => { state.error = action.payload; });
    }
})

export default locationSlice.reducer