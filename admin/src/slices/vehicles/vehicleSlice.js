import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";


export const getVehicles = createAsyncThunk("/vehicles", async (query,{ rejectWithValue }) => {
    try {
        const queryString = new URLSearchParams(query).toString(); 
        const response = await api.get(`/api/v1/get/vehicles?${queryString}`);
        
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.data)
    }
})



export const getVehicleDetails = createAsyncThunk("/vehicle/details", async (id,{ rejectWithValue }) => {
    try {
        const response = await api.get(`/api/v1/get/vehicle/details/${id}`)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.data)
    }
})



//admin



export const addVehicle = createAsyncThunk("/vehicle/add", async (data,{ rejectWithValue }) => {
    try {
        const response = await api.post(`/admin/add/vehicle`,data,  {
            headers: { 'Content-Type': 'multipart/form-data', },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateVehicle = createAsyncThunk("/vehicle/update", async ({id,updatedData},{ rejectWithValue }) => {
    try {
        const response = await api.put(`/admin/update/vehicle/${id}`,updatedData,  {
            headers: { 'Content-Type': 'multipart/form-data', },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const handleFeatureVehicle = createAsyncThunk("/vehicle/feature", async (id,{ rejectWithValue }) => {
    try {
        const response = await api.put(`/admin/feature/vehicle/${id}`)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteVehicle = createAsyncThunk("/vehicle/delete", async (id,{ rejectWithValue }) => {
    try {
        const response = await api.delete(`/admin/delete/vehicle/${id}`)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const vehicleSlice = createSlice({
    name:"vehicle",
    initialState:{
        vehicles:null,
        details:null,
        total:null,
        pagination:true,
        featured:null,
        loading:true,
        error:null,
        formError:null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(getVehicles.pending,( state ) => {
                state.error = null,
                state.loading = true
            })
            .addCase(getVehicles.fulfilled, ( state, action ) => {
                state.vehicles = action.payload.data.vehicles
                state.pagination = action.payload.pagination
                state.loading = false
                
            })
            .addCase(getVehicles.rejected, ( state, action ) => {

            })
            .addCase(getVehicleDetails.pending,( state ) => {
                state.error = null,
                state.loading = true
            })
            .addCase(getVehicleDetails.fulfilled, ( state, action ) => {
                state.details = action.payload
                state.loading = false
                
            })
            .addCase(getVehicleDetails.rejected, ( state, action ) => {

            })
            .addCase(deleteVehicle.pending)
            .addCase(deleteVehicle.fulfilled,(state,action) => {
                const vehicleId = action.payload._id;
                state.vehicles = state.vehicles.filter(vehicle => vehicle._id !== vehicleId);})
            .addCase(deleteVehicle.rejected)
            .addCase(handleFeatureVehicle.pending)
            .addCase(handleFeatureVehicle.fulfilled, (state, action) => {
                const updatedVehicle = action.payload; 
              
                state.vehicles = state.vehicles.map((vehicle) =>
                  vehicle._id === updatedVehicle._id
                    ? { ...vehicle, isFeatured: updatedVehicle.isFeatured }  
                    : vehicle
                );
              })  
            .addCase(handleFeatureVehicle.rejected)
            .addCase(updateVehicle.pending,(state,action) => {
                state.formError = null
            })
            .addCase(updateVehicle.fulfilled,(state,action) => {
                
            })
            .addCase(updateVehicle.rejected,(state,action) => {
                state.formError = action.payload
            })
            .addCase(addVehicle.pending,(state,action) => {
                state.formError = null
            })
            .addCase(addVehicle.fulfilled,(state,action) => {
                
            })
            .addCase(addVehicle.rejected,(state,action) => {
                state.formError = action.payload
            })
            
    }
})


export default vehicleSlice.reducer