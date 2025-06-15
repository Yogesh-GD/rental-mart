import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const paymentProcess = createAsyncThunk("payment/process",async (credentials, {rejectWithValue}) => {
    try {
        const response = await api.post("/user/book/vehicle/processing/payment",credentials,{
            headers: {
                'Content-Type': 'application/json',
              },
        })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.value)
    }
})

const paymentSlice = createSlice({
    name:"payment",
    initialState:{
        status:"idle",
        formError:null
    },
    reducers : {
        setFormStatus : (state,action) => {
            state.status = action.payload
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(paymentProcess.pending,(state,action) => {
                state.status = "processing"
                state.formError = null
            })
            .addCase(paymentProcess.fulfilled,(state,action) => {
                state.status = "procceed"
                state.formError = null
            })
            .addCase(paymentProcess.rejected,(state,action) => {
                state.status = "failed"
                state.formError = action.payload
            })
    }
})

export const { setFormStatus } = paymentSlice.actions

export default paymentSlice.reducer