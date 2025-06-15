import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";


export const getUserProfile = createAsyncThunk("/user/profile", async (__dirname, { rejectWithValue }) => {
    try {
        const response = await api.post("/user/profile")
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const updateUserProfile = createAsyncThunk("/user/update/profile", async (data, { rejectWithValue }) => {
    try {
        const response = await api.put("/user/update/profile", data, {
            headers: { 'Content-Type': 'multipart/form-data', },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const getUserNotifications = createAsyncThunk("user/notificatons/get", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`/user/get/notifications`)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateUserNotification = createAsyncThunk("user/notificaton/update", async (id, { rejectWithValue }) => {
    try {
        const response = await api.put(`/user/update/notification/${id}`)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})



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

export const UpdatePassword = createAsyncThunk("user/change/password", async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.put("/user/change/password", credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return response.data.data
    } catch (error) {

        return rejectWithValue(error.response.data)
    }
})

export const updateLicenseDetails = createAsyncThunk("user/update/license", async (credentials,{ rejectWithValue }) => {
    try {
        const response = await api.put("/user/update/driving-license", credentials, {
            headers: { 'Content-Type': 'multipart/form-data', },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.data)
    }
})

export const addLicenseDetails = createAsyncThunk("user/add/license", async (credentials,{ rejectWithValue }) => {
    try {
        const response = await api.post("/user/add/driving-license", credentials, {
            headers: { 'Content-Type': 'multipart/form-data', },
        })
        console.log(response.data)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.data)
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
            .addCase(getUserProfile.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload
                state.loading = false
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })
            .addCase(updateUserProfile.pending, (state, action) => {
                state.status = "submitting"
                state.error = null
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.status = "succeed"
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload
            })
            .addCase(getUserNotifications.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(getUserNotifications.fulfilled, (state, action) => {
                state.loading = false
                state.notifications = action.payload.data.notifications
                state.pagination = action.payload.notifications
            })
            .addCase(getUserNotifications.rejected, (state) => {
                state.loading = false
                state.error = action.pagination
            })
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
            .addCase(updateUserNotification.pending, (state, action) => {

            })
            .addCase(updateUserNotification.fulfilled, (state, action) => {
                const updatedNotification = action.payload;

                state.notifications = state.notifications.map((notification) =>
                    notification._id === updatedNotification._id
                        ? { ...notification, isRead: true }
                        : notification
                );
            })
            .addCase(updateUserNotification.rejected, (state, action) => {

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
            .addCase(UpdatePassword.pending, (state, action) => {
                state.formError = null
                state.status = "submitting"
            })
            .addCase(UpdatePassword.fulfilled, (state, action) => {
                state.status = "succeed"
            })
            .addCase(UpdatePassword.rejected, (state, action) => {
                state.status = "failed"
                state.formError = action.payload
            })
            .addCase(updateLicenseDetails.pending, (state, action) => {
                state.formError = null
                state.status = "submitting"
            })
            .addCase(updateLicenseDetails.fulfilled, (state, action) => {
                state.status = "succeed"
                state.profile = action.payload
            })
            .addCase(updateLicenseDetails.rejected, (state, action) => {
                state.status = "failed"
                state.formError = action.payload
            })
            .addCase(addLicenseDetails.pending, (state, action) => {
                state.formError = null
                state.status = "submitting"
            })
            .addCase(addLicenseDetails.fulfilled, (state, action) => {
                state.status = "succeed"
                state.profile = action.payload
            })
            .addCase(addLicenseDetails.rejected, (state, action) => {
                state.status = "failed"
                state.formError = action.payload
            })

    }
})

export default userSlice.reducer