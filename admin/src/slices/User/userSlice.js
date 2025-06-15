import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";









//admin
export const getUsers = createAsyncThunk("/user/get/users", async (data, { rejectWithValue }) => {
    try {
        const response = await api.get(`/admin/get/users`, { params: data });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
});


export const getUserProfileByAdmin = createAsyncThunk("/user/get/profile", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/admin/get/user/profile/${id}`,)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateUserProfileByAdmin = createAsyncThunk("/user/admin/update/profile", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/admin/update/user/profile/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data', },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteUserByAdmin = createAsyncThunk("/user/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/admin/delete/user/${id}`,)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteUserTemp = createAsyncThunk("/user/temp/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`/admin/delete/user/temp/${id}`,)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const addUserByAdmin = createAsyncThunk("user/add", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/admin/add/user", data, {
            headers: { 'Content-Type': 'multipart/form-data', },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})



const userSlice = createSlice({
    name: "vehicle",
    initialState: {
        profile: null,
        bookings: null,
        notifications: null,
        pagination: null,
        totalUsers: 0,
        users: null,
        loading: true,
        status: "idle",
        error: null,
        formError: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false
                state.users = action.payload.data.users
                state.pagination = action.payload.pagination
                state.totalUsers = action.payload.data.totalUsers

            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(getUserProfileByAdmin.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserProfileByAdmin.fulfilled, (state, action) => {
                state.profile = action.payload
                state.loading = false
            })
            .addCase(getUserProfileByAdmin.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })
            .addCase(updateUserProfileByAdmin.pending, (state, action) => {
                state.status = "idle"
                state.formError = null
            })
            .addCase(updateUserProfileByAdmin.fulfilled, (state, action) => {
                state.status = "succeed"
            })
            .addCase(updateUserProfileByAdmin.rejected, (state, action) => {
                state.status = "failed"
                state.formError = action.payload
            })
            .addCase(deleteUserByAdmin.pending)
            .addCase(deleteUserByAdmin.fulfilled)
            .addCase(deleteUserByAdmin.rejected)
            .addCase(deleteUserTemp.pending)
            .addCase(deleteUserTemp.fulfilled)
            .addCase(deleteUserTemp.rejected)
            .addCase(addUserByAdmin.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(addUserByAdmin.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(addUserByAdmin.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default userSlice.reducer