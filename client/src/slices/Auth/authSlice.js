import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie";


//user

export const userLogout = createAsyncThunk("/auth/user/logout", async (_,{ rejectWithValue }) => {
    try {
        const response = await api.delete(`/auth/user/logout`)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})



export const userLogin = createAsyncThunk("/auth/user/login", async (credentials,{ rejectWithValue }) => {
    try {
        const response = await api.post(`/auth/user/login`,credentials,{
            headers: {
                'Content-Type': 'application/json',
              },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const userRegister = createAsyncThunk("/auth/user/Register", async (credentials,{ rejectWithValue }) => {
    try {
        const response = await api.post(`/auth/user/register`,credentials,{
            headers: {
                'Content-Type': 'application/json',
              },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


const authSlice = createSlice({
    name:"auth",
    initialState:{
       status:"idle",
       error:null,
       isUserAuthenticated :false,
    },
    reducers : {
        updateUserAuthentication : (state,action) => {
            console.log(action.payload)
            state.isUserAuthenticated = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending,(state,action) => {
                state.status = "submitting"
                state.error = null
            })
            .addCase(userLogin.fulfilled,(state,action) => {
                state.status = "succeed"
                Cookies.set("isUserAuthenticated", true, {  
                    secure: true,
                    expires: 7,
                });
            })  
            .addCase(userLogin.rejected,(state,action) => {
                state.status = "failed"
                Cookies.remove("isUserAuthenticated");
                state.error = action.payload

            })
            .addCase(userLogout.pending,(state,action) => {
                state.status = "loogingOut"
                state.error = null
            })
            .addCase(userLogout.fulfilled,(state,action) => {
                state.status = "userLoggedOut"
                Cookies.remove("isUserAuthenticated");
            })
            .addCase(userLogout.rejected,(state,action) => {
                state.status = "failed"
                state.error = action.payload
            })
            .addCase(userRegister.pending,(state,action) => {
                state.status = "submitting"
                state.error = null
            })
            .addCase(userRegister.fulfilled,(state,action) => {
                state.status = "registered"
            })
            .addCase(userRegister.rejected,(state,action) => {
                state.status = "failed"
                state.error = action.payload
            })
          
    }
})

export const { updateUserAuthentication }  = authSlice.actions

export default authSlice.reducer