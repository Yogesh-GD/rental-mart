import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const getLocations = createAsyncThunk("locaion/get/locations", async (_,{ rejectWithValue }) => {
    try {
        const response = await api.get("/api/v1/get/locations")
        return response.data.data
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})

const locationSlice = createSlice({
    name:"location",
    initialState:{
        locations:null,
        loading:null,
        erorr:null
    },
    extraReducers : (builder) => {
        builder
            .addCase(getLocations.pending,(state,action) => {
                state.loading = true
                state.erorr = null
            })
            .addCase(getLocations.fulfilled,(state,action) => {
                state.loading = false
                state.locations = action.payload
                state.erorr = null
            })
            .addCase(getLocations.rejected,(state,action) => {
                state.loading = false
                state.erorr = action.payload
            })
    }
})

export default locationSlice.reducer