import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoard, selectBoard, updateBoard } from '~/redux/slices/boardSlice'
import { useParams } from 'react-router-dom'
import ModalCardDetail from '~/components/ModalCardDetail/ModalCardDetail'
import { useState } from 'react'
import { selectCurrentActiveCard } from '~/redux/slices/activeCardSlice'
import socket from '~/utils/socket'

function Board() {
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const board = useSelector(selectBoard)
  const currentActiveCard = useSelector(selectCurrentActiveCard)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchBoard(boardId)).then(() => {
      socket.emit('c_joinBoard', boardId)
      setIsLoading(false)
    })

    return () => {
      socket.emit('c_leaveBoard', boardId)
    }
  }, [dispatch, boardId])

  useEffect(() => {
    socket.on('s_changeBoardData', (updatedBoard) => {
      if (updatedBoard._id === boardId) {
        dispatch(updateBoard(updatedBoard))
      }
    })

    return () => {
      socket.off('s_changeBoardData')
    }
  }, [dispatch, boardId])

  if (isLoading || !board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', gap: 2 }}>
        <CircularProgress />
        <Typography> Loading board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }} {...!board.role && { "data-no-dnd": "true" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
      />
      {currentActiveCard && currentActiveCard.boardId === boardId && <ModalCardDetail />}
    </Container >
  )


}

export default Board
