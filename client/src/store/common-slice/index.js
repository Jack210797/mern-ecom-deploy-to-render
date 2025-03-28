import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  featureImageList: []
}

export const getFeatureImages = createAsyncThunk('/order/getFeatureImages', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/common/feature/get`)

  return response.data
})
export const addFeatureImage = createAsyncThunk('/order/addFeatureImage', async (image) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/common/feature/add`, image)

  return response.data
})

const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false
        state.featureImageList = action.payload.data
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false
        state.featureImageList = []
      })
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false
        state.featureImageList.push(action.payload.data)
      })
      .addCase(addFeatureImage.rejected, (state) => {
        state.isLoading = false
      })
  }
})

export default commonSlice.reducer
