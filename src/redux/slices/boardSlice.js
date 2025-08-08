/* eslint-disable indent */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBoardDetailsAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatter'
import { BOARD_ROLES } from '~/utils/constants'
import socket from '~/utils/socket'

export const fetchBoard = createAsyncThunk('boards/fetchBoard', async (boardId) => {
  return await fetchBoardDetailsAPI(boardId)
})

export const boardSlice = createSlice({
  name: 'board',
  initialState: {
    data: null
  },
  reducers: {
    updateBoard: (state, action) => {
      const updatedBoard = action.payload
      updatedBoard.role = state.data.role
      state.data = updatedBoard
    },
    addColumn: (state, action) => {
      const column = action.payload
      // tạo mới column chưa có card tạo placehoder card
      column.cards = [generatePlaceholderCard(column)]
      column.cardOrderIds = [generatePlaceholderCard(column)._id]

      state.data.columns.push(column)
      state.data.columnOrderIds.push(column._id)
      socket.emit('c_changeBoardData', state.data)
    },
    moveColumn: (state, action) => {
      state.data.columns = action.payload.columns
      state.data.columnOrderIds = action.payload.columnOrderIds
      socket.emit('c_changeBoardData', state.data)
    },
    deleteColumn: (state, action) => {
      state.data.columns = state.data.columns.filter(c => c._id !== action.payload)
      state.data.columnOrderIds = state.data.columnOrderIds.filter(c => c._id !== action.payload)
      socket.emit('c_changeBoardData', state.data)
    },
    updateColumns: (state, action) => {
      state.data.columns = action.payload
      socket.emit('c_changeBoardData', state.data)
    },
    addCard: (state, action) => {
      const createdCard = action.payload
      const columnToUpdate = state.data.columns.find(column => column._id === createdCard.columnId)

      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        // xóa card placeholder
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
      socket.emit('c_changeBoardData', state.data)
    },
    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload
      const columnToUpdate = state.data.columns.find(column => column._id === incomingCard.columnId)
      if (columnToUpdate) {
        const card = columnToUpdate.cards.find(card => card._id === incomingCard._id)
        if (card) {
          const updateKeys = ["title", "description", "cover", "memberIds", "members", "comments"]
          updateKeys.forEach(key => {
            if (incomingCard[key] !== undefined) {
              card[key] = incomingCard[key]
            }
          })
        }
      }
      socket.emit('c_changeBoardData', state.data)
    },
    updateMembers: (state, action) => {
      const { role, userId } = action.payload
      switch (role) {
        case BOARD_ROLES.ADMIN: {
          // nếu role là admin chuyển thành member
          const user = state.data.members.find(member => member._id === userId)
          if (user) {
            state.data.members = state.data.members.filter(member => member._id !== userId)
            state.data.memberIds = state.data.memberIds.filter(id => id !== userId)
            state.data.owners.push(user)
            state.data.ownerIds.push(user._id)
          }
          break;
        }
        case BOARD_ROLES.MEMBER: {
          // nếu role là admin chuyển thành member
          const user = state.data.owners.find(owner => owner._id === userId)
          if (user) {
            state.data.owners = state.data.owners.filter(owner => owner._id !== userId)
            state.data.ownerIds = state.data.ownerIds.filter(id => id !== userId)
            state.data.members.push(user)
            state.data.memberIds.push(user._id)
          }

          break;
        }
        default:
          // nếu role là null thì xóa user khỏi board
          state.data.members = state.data.members.filter(member => member._id !== userId)
          state.data.owners = state.data.owners.filter(owner => owner._id !== userId)
          state.data.memberIds = state.data.memberIds.filter(id => id !== userId)
          state.data.ownerIds = state.data.ownerIds.filter(id => id !== userId)
          break;
      }
      socket.emit('c_changeBoardData', state.data)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.fulfilled, (state, action) => {
        let board = action.payload
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            // nếu column không có card tạo card placeholder để có thể kéo thả card
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
            column.cards.forEach(card => {
              let members = []
              if (Array.isArray(card.memberIds) && card.memberIds.length > 0) {
                card.memberIds.forEach(memberId => {
                  const member = [...board.members, ...board.owners].find(m => m._id === memberId)
                  if (member) {
                    members.push(member)
                  }
                })
              }
              card.members = members
              card.comments = [...card.comments].reverse()
            })
          }
        })
        state.data = board
      })
  }
})

export const { updateBoard, addColumn, moveColumn, addCard, updateColumns, deleteColumn, updateCardInBoard, updateMembers } = boardSlice.actions

export const selectBoard = (state) => {
  return state.board.data
}

export default boardSlice.reducer