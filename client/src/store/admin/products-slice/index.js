import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  productList: [],
  isLoading: false
}

export const addNewProduct = createAsyncThunk('/products/addNewProduct', async (formData) => {
  const result = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/add`, formData, {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

  return result?.data
})

export const fetchAllProduct = createAsyncThunk('/products/fetchAllProduct', async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`)

  return result?.data
})

export const editProduct = createAsyncThunk('/products/editProduct', async ({ id, formData }) => {
  const result = await axios.put(`${import.meta.env.VITE_API_URL}0/api/admin/products/edit/${id}`, formData, {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

  return result?.data
})

export const deleteProduct = createAsyncThunk('/products/deleteProduct', async (id) => {
  const result = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`)

  return result?.data
})

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.productList = action.payload.data
      })
      .addCase(fetchAllProduct.rejected, (state, action) => {
        state.isLoading = false
        state.productList = []
      })
  }
})

export default adminProductsSlice.reducer
