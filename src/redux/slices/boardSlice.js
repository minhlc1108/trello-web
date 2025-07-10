import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBoardDetailsAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatter'

export const fetchBoard = createAsyncThunk('boards/fetchBoard', async (boardId) => {
  return await fetchBoardDetailsAPI(boardId)
})

export const boardSlice = createSlice({
  name: 'board',
  initialState: {
    data: null
  },
  reducers: {
    addColumn: (state, action) => {
      const column = action.payload
      // tạo mới column chưa có card tạo placehoder card
      column.cards = [generatePlaceholderCard(column)]
      column.cardOrderIds = [generatePlaceholderCard(column)._id]

      state.data.columns.push(column)
      state.data.columnOrderIds.push(column._id)
    },
    moveColumn: (state, action) => {
      state.data.columns = action.payload.columns
      state.data.columnOrderIds = action.payload.columnOrderIds
    },
    deleteColumn: (state, action) => {
      state.data.columns = state.data.columns.filter(c => c._id !== action.payload)
      state.data.columnOrderIds = state.data.columnOrderIds.filter(c => c._id !== action.payload)
    },
    updateColumns: (state, action) => {
      state.data.columns = action.payload
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

export const { addColumn, moveColumn, addCard, updateColumns, deleteColumn, updateCardInBoard } = boardSlice.actions

export const selectBoard = (state) => {
  return state.board.data
}

export default boardSlice.reducer