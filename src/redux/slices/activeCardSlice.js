import { createSlice } from '@reduxjs/toolkit'
import socket from '~/utils/socket'
import { updateMembers } from './boardSlice'

const initialState = {
  currentActiveCard: null
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    },
    updateTitleCurrentActiveCard: (state, action) => {
      if (state.currentActiveCard) {
        state.currentActiveCard.title = action.payload
        socket.emit('c_changeActiveCard', state.currentActiveCard)
      }
    },
    updateDescriptionCurrentActiveCard: (state, action) => {
      if (state.currentActiveCard) {
        state.currentActiveCard.description = action.payload
        socket.emit('c_changeActiveCard', state.currentActiveCard)
      }
    },
    updateCommentCurrentActiveCard: (state, action) => {
      if (state.currentActiveCard) {
        state.currentActiveCard.comments = action.payload
        socket.emit('c_changeActiveCard', state.currentActiveCard)
      }
    },
    updateCoverCurrentActiveCard: (state, action) => {
      if (state.currentActiveCard) {
        state.currentActiveCard.cover = action.payload
        socket.emit('c_changeActiveCard', state.currentActiveCard)
      }
    },
    updateMembersCurrentActiveCard: (state, action) => {
      if (state.currentActiveCard) {
        const { memberIds, members } = action.payload
        state.currentActiveCard.memberIds = memberIds
        state.currentActiveCard.members = members
        socket.emit('c_changeActiveCard', state.currentActiveCard)
      }
    }
  }
})

export default activeCardSlice.reducer

export const { clearCurrentActiveCard, updateCommentCurrentActiveCard, updateCoverCurrentActiveCard, updateCurrentActiveCard, updateDescriptionCurrentActiveCard, updateMembersCurrentActiveCard, updateTitleCurrentActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => state.activeCard.currentActiveCard
