import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { signInUserAPI, signOutUserAPI, updateUserAPI } from '~/apis'

const initialState = {
  currentUser: null,
  isAuthenticated: false
}

export const signIn = createAsyncThunk('users/signIn', async (data) => {
  return await signInUserAPI(data)
})

export const signOut = createAsyncThunk('users/signOut', async () => {
  return await signOutUserAPI()
})

export const update = createAsyncThunk('user/update', async (data) => {
  const respone = await updateUserAPI(data)
  return respone
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(signOut.fulfilled, (state, action) => {
      state.currentUser = null
      state.isAuthenticated = false
    })
    builder.addCase(update.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
  }
})

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const selectIsAuthenticated = (state) => {
  return state.user.isAuthenticated
}

export default userSlice.reducer