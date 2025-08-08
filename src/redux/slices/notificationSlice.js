import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { deleteInviteAPI, getInvitesAPI, updateInviteStatusAPI } from '~/apis'

const initialState = {
  currentNotifications: null
}

export const fetchNotifications = createAsyncThunk('notifications/fetchInvitations', async () => {
  const response = await getInvitesAPI()
  return response
})

export const updateInvitation = createAsyncThunk('notifications/updateInvitation', async ({ inviteId, data }) => {
  const response = await updateInviteStatusAPI(inviteId, data)
  return response
})

export const deleteInvitation = createAsyncThunk('notifications/deleteInvitation', async (inviteId) => {
  const response = await deleteInviteAPI(inviteId)
  return response
})

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const incomingInvitations = action.payload
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    })
      .addCase(updateInvitation.fulfilled, (state, action) => {
        const updatedInvitation = action.payload
        const invitation = state.currentNotifications.find(invite => invite._id === updatedInvitation._id)
        invitation.status = updatedInvitation.status
      })
      .addCase(deleteInvitation.fulfilled, (state, action) => {
        const deletedInviteId = action.meta.arg
        state.currentNotifications = state.currentNotifications.filter(invite => invite._id !== deletedInviteId)
      })
  }
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationSlice.actions

export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

export const notificationReducer = notificationSlice.reducer
export default notificationReducer