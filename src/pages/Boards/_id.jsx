import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
// import { mockData } from '~/apis/mock-data'
function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // tạm thời fix cứng boardId, sau dùng react-router-dom để lấy boardId từ Url về
    const boardId = '6658b2bbefe6fa78ac4369d0'
    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
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

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} />
    </Container >
  )
}

export default Board
