import moment from 'moment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/slices/userSlice'
import { Button, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { updateCardDetailsAPI } from '~/apis'
import { updateCommentCurrentActiveCard } from '~/redux/slices/activeCardSlice'
import { updateCardInBoard } from '~/redux/slices/boardSlice'

function CardActivitySection({ card }) {
  const currentUser = useSelector(selectCurrentUser)
  const role = useSelector(state => state.board.data.role)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const handleAddCardComment = async (event) => {
    // Bắt hành động người dùng nhấn phím Enter && không phải hành động Shift + Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      await handleSendComment()
    }
  }

  const handleSendComment = async () => {
    setIsLoading(true)
    if (!content) return // Nếu không có giá trị gì thì return không làm gì cả
    const commentToAdd = {
      userAvatar: currentUser?.avatar,
      userDisplayName: currentUser?.displayName,
      content: content.trim()
    }
    const cardUpdated = await updateCardDetailsAPI(card._id, { boardId: card.boardId, incomingComment: commentToAdd })
    dispatch(updateCommentCurrentActiveCard([...cardUpdated.comments].reverse()))
    dispatch(updateCardInBoard({ ...card, comments: [...cardUpdated.comments].reverse() }))
    setContent("") // Reset lại giá trị content sau khi gửi comment
    setIsLoading(false)
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Xử lý thêm comment vào Card */}
      {role !== null &&
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar
            sx={{ width: 36, height: 36, cursor: 'pointer' }}
            alt="trungquandev"
            src={currentUser?.avatar}
          />
          <TextField
            fullWidth
            placeholder="Write a comment..."
            type="text"
            variant="outlined"
            multiline
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleAddCardComment}
          />
          {content && <Button variant="contained" disabled={isLoading} className='interceptor-loading' color="primary" onClick={handleSendComment}>
            {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Send'}
          </Button>}
        </Box>
      }

      {/* Hiển thị danh sách các comments */}
      {card?.comments?.length === 0 &&
        <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>No activity found!</Typography>
      }
      {card?.comments?.map((comment, index) =>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
          <Tooltip title={comment.userDisplayName}>
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              alt={comment.userDisplayName}
              src={comment.userAvatar}
            />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {comment.userDisplayName}
            </Typography>

            <Typography variant="span" sx={{ fontSize: '12px' }}>
              {moment(comment.createdAt).format('llll')}
            </Typography>

            <Box sx={{
              display: 'block',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
              p: '8px 12px',
              mt: '4px',
              border: '0.5px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              wordBreak: 'break-word',
              boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)'
            }}>
              {comment.content}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardActivitySection
