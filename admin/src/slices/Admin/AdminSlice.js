import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const getAdminDashboardData = createAsyncThunk("admin/dashboard", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/admin/dashboard");
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const sendNotificationToUser = createAsyncThunk("admin/user/notification", async ({id,data}, { rejectWithValue }) => {
    try {
        const response = await api.post(`/admin/send/user/notification/${id}`,data,{
            headers: {
                'Content-Type': 'application/json',
              },
        });
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const sendNotificationToAll = createAsyncThunk("admin/all/notification", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post(`/admin/send/all/notification`,data,{
            headers: {
                'Content-Type': 'application/json',
              },
        });
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const UpdatePassword = createAsyncThunk("admin/change/password",async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.put("/admin/change/password",credentials,{
            headers: {
                'Content-Type': 'application/json',
              },
        })

        return response.data.data
    } catch (error) {
        
        return rejectWithValue(error.response.data)
    }
})

const adminSlice = createSlice({
    name: "vehicle",
    initialState: {
        dashboardData: null,
        profile: null,
        loading: true,
        error: null,
        sending:false,
         successMessage:null,
         formError:null,
         status:"idle"
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
            })
            .addCase(getAdminDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendNotificationToUser.pending, (state) => {
                state.sending = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(sendNotificationToUser.fulfilled, (state, action) => {
                state.sending = false;
                state.successMessage = "Notification sent successfully"; 
            })
            .addCase(sendNotificationToUser.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            })
            .addCase(sendNotificationToAll.pending, (state) => {
                state.sending = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(sendNotificationToAll.fulfilled, (state, action) => {
                state.sending = false;
                state.successMessage = "Notification sent successfully"; 
            })
            .addCase(sendNotificationToAll.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            })
            .addCase(UpdatePassword.pending,(state,action) => {
                state.formError = null
                state.status = "submitting"
            })
            .addCase(UpdatePassword.fulfilled,(state,action) => {
                state.status = "succeed"
            })
            .addCase(UpdatePassword.rejected,(state,action) => {
                state.status = "failed"
                state.formError = action.payload
            })

    }
})

export default adminSlice.reducer