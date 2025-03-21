import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { capturePayment } from '../order-slice'

const initialState = {
  cartItems: [],
  isLoading: false
}

export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, productId, quantity }) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/cart/add`, {
    userId,
    productId,
    quantity
  })

  if (response.data.data && response.data.data._id) {
    localStorage.setItem('cartId', response.data.data._id)
  }

  return response.data
})

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (userId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`)

  if (response.data.data && response.data.data._id) {
    localStorage.setItem('cartId', response.data.data._id)
  }

  return response.data
})

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', async ({ userId, productId }) => {
  const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`)

  if (response.data.data && response.data.data._id) {
    localStorage.setItem('cartId', response.data.data._id)
  }

  return response.data
})

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`, {
      userId,
      productId,
      quantity
    })

    if (response.data.data && response.data.data._id) {
      localStorage.setItem('cartId', response.data.data._id)
    }

    return response.data
  }
)

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []
      localStorage.removeItem('cartId')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(capturePayment.fulfilled, (state) => {
        state.cartItems = []
        localStorage.removeItem('cartId')
      })
  }
})

export const { clearCart } = shoppingCartSlice.actions
export default shoppingCartSlice.reducer
