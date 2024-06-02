import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import {
  fetchBoardDetailsAPI,
  updateBoardDetailsAPI,
  createNewColumnAPI,
  updateColumnDetailsAPI,
  createNewCardAPI,
  moveCardToDifferenceColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

// import { mockData } from '~/apis/mock-data'
function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tạm thời fix cứng boardId, sau dùng react-router-dom để lấy boardId từ Url về
    const boardId = '6658b2bbefe6fa78ac4369d0'
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
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
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // khi tạo column mới chưa có card cần có 1 placeholder card để xử lý kéo thả
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    // cập nhật state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // cập nhật state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    columnToUpdate.cards.push(createdCard)
    columnToUpdate.cardOrderIds.push(createdCard._id)
    setBoard(newBoard)
  }

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    // gọi api update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnIds })
  }

  // Khi kéo thả card trong cùng column chỉ cần gọi API cập nhật lại cardOrderIds của column chứa nó
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    columnToUpdate.cards = dndOrderedCards
    columnToUpdate.cardOrderIds = dndOrderedCardIds
    setBoard(newBoard)

    // gọi api update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // Khi di chuyển card sang column khác:
  /**
   * b1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (bản chất là xóa cardId đi trong mảng)
   * b2: Cập nhật mảng cardOrderIds của Column tiếp theo(bản chất là thêm cardId vào trong mảng)
   * b3: Cập nhật mảng trường columnId mới của card đã kéo
   */
  const moveCardToDifferenceColumn = (cardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // update lại state board
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    // call api move card
    moveCardToDifferenceColumnAPI({
      cardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find(column => column._id === prevColumnId).cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(column => column._id === nextColumnId).cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', gap: 2 }}>
        <CircularProgress />
        <Typography> Loading board...</Typography>
      </Box>
    )
  } else {
    return (
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <AppBar />
        <BoardBar board={board} />
        <BoardContent
          board={board}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          moveColumns={moveColumns}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          moveCardToDifferenceColumn={moveCardToDifferenceColumn} />
      </Container >
    )

  }
}

export default Board
