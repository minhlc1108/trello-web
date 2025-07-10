import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoard, selectBoard } from '~/redux/slices/boardSlice'
import { useParams } from 'react-router-dom'
import ModalCardDetail from '~/components/ModalCardDetail/ModalCardDetail'
import { useState } from 'react'
import { selectCurrentActiveCard } from '~/redux/slices/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const board = useSelector(selectBoard)
  const currentActiveCard = useSelector(selectCurrentActiveCard)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchBoard(boardId)).then(() => {
      setIsLoading(false)
    })
  }, [dispatch, boardId])

  if (isLoading || !board) {
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
        />
        {currentActiveCard && currentActiveCard.boardId === boardId && <ModalCardDetail />}
      </Container >
    )

  }
}

export default Board
