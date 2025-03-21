import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  reviewList: []
}

export const addReview = createAsyncThunk('/order/addReview', async (formData) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/add`, formData)

  return response.data
})

export const getReviews = createAsyncThunk('/order/getReviews', async (id) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/${id}`)

  return response.data
})

export const shopReviewSlice = createSlice({
  name: 'reviewSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false
        state.reviewList = action.payload.data
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false
        state.reviewList = []
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false
        state.reviewList = action.payload.data
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false
        state.reviewList = []
      })
  }
})

export default shopReviewSlice.reducer
