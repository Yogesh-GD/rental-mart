import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";

//admin
export const adminLogin = createAsyncThunk("/auth/admin/login", async (credentials,{ rejectWithValue }) => {
    try {
        const response = await api.post(`/auth/admin/login`,credentials,{
            headers: {
                'Content-Type': 'application/json',
              },
        })
        return response.data.data
    } catch (error) {
        
        return rejectWithValue(error.response.data)
    }
})

export const adminLogout = createAsyncThunk("/auth/admin/logout", async (_,{ rejectWithValue }) => {
    try {
        const response = await api.delete(`/auth/admin/logout`)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

//user




const authSlice = createSlice({
    name:"auth",
    initialState:{
       status:"idle",
       error:null,
       isAdminAuthenticated :false,
    },
    reducers : {
        updateUserAuthentication : (state,action) => {
            console.log(action.payload)
            state.isUserAuthenticated = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending,(state,action) => {
                state.status = "submitting"
                state.error = null
            })
            .addCase(adminLogin.fulfilled,(state,action) => {
                state.status = "succeed"
                Cookies.set("isAdminAuthenticated", true, {  
                    secure: true,
                    expires: 7,
                });
            })  
            .addCase(adminLogin.rejected,(state,action) => {
                state.status = "failed"
                state.error = action.payload
                Cookies.remove("isAdminAuthenticated");
            })
            .addCase(adminLogout.pending,(state,action) => {
                state.status = "loggingOut"
                state.error = null
            })
            .addCase(adminLogout.fulfilled,(state,action) => {
                state.status = "adminloggedOut"
                Cookies.remove("isAdminAuthenticated");
            })
            .addCase(adminLogout.rejected,(state,action) => {
                state.status = "failed"
                state.error = action.payload
            })
            
          
    }
})

export const { updateUserAuthentication }  = authSlice.actions

export default authSlice.reducer