import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchBoardDetailsAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatter'

export const fetchBoard = createAsyncThunk('boards/fetchBoard', async (boardId) => {
  return await fetchBoardDetailsAPI(boardId).then((board) => {
    board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
    board.columns.forEach(column => {
      if (isEmpty(column.cards)) {
        // nếu column không có card tạo card placeholder để có thể kéo thả card
        column.cards = [generatePlaceholderCard(column)]
        column.cardOrderIds = [generatePlaceholderCard(column)._id]
      } else {
        column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
      }
    })
    return board
  })
})

export const boardSlice = createSlice({
  name: 'board',
  initialState: {
    isLoading: true,
    data: [],
    error: ''
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.isLoading = true
        state.error = action.payload
      })
  }
})

export const { addColumn, moveColumn, addCard, updateColumns, deleteColumn } = boardSlice.actions