import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null
}

export const registerUser = createAsyncThunk('auth/register', async (formData) => {
  const responce = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, {
    withCredentials: true
  })
  return responce.data
})

export const loginUser = createAsyncThunk('auth/login', async (formData) => {
  const responce = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, {
    withCredentials: true
  })
  return responce.data
})

export const logoutUser = createAsyncThunk('auth/logout', async (formData) => {
  const responce = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true })
  return responce.data
})

// export const checkAuth = createAsyncThunk('auth/checkauth', async () => {
//   const responce = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
//     withCredentials: true,
//     Headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate', Expires: '0' }
//   })
//   return responce.data
// })

export const checkAuth = createAsyncThunk('auth/checkauth', async (token) => {
  const responce = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate'
    }
  })
  return responce.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    resetTokenAndCredentials: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = action.payload.success
        state.token = action.payload.token
        sessionStorage.setItem('token', JSON.stringify(action.payload.token))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.token = null
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = action.payload.success
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
  }
})

export const { setUser, resetTokenAndCredentials } = authSlice.actions
export default authSlice.reducer
