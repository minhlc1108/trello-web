import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/slices/userSlice'
import { selectBoard } from '~/redux/slices/boardSlice'

function SelectRole({ role, _id }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedRole, setSelectedRole] = React.useState(role)
  const currentUser = useSelector(selectCurrentUser)
  const currentBoard = useSelector(selectBoard)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isMember = currentBoard.members.some(user => user._id === currentUser._id)
  const isAdmin = currentBoard.owners.some(user => user._id === _id)
  const isLastAdmin = currentBoard.owners.length === 1 && currentBoard.owners[0]._id === _id

  return (
    <Box>
      <Button
        sx={{ color: theme => theme.palette.mode === 'dark' ? "#fff" : "#0c66e4", backgroundColor: theme => theme.palette.mode === "dark" ? "rgb(144 202 249 / 8%)" : "#e9f2ff" }}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        {selectedRole === 'admin' ? 'Admin' : selectedRole === 'member' ? 'Member' : ''}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disabled={isMember} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { setSelectedRole('admin'); handleClose(); }}>
          <Typography variant='p'>Admin</Typography>
        </MenuItem>
        <MenuItem disabled={isMember || isLastAdmin} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { setSelectedRole('member'); handleClose(); }}>
          <Typography variant='p'>Member</Typography>
          {isLastAdmin && <span style={{ fontSize: '12px', color: 'gray' }}>Board must have at least one admin.</span>}
        </MenuItem>
        {currentUser._id === _id && (
          <MenuItem disabled={isLastAdmin} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { setSelectedRole('leave'); handleClose(); }}>
            <Typography variant='p'>Leave</Typography>
            {isLastAdmin && <span style={{ fontSize: '12px', color: 'gray' }}>Board must have at least one admin.</span>}
          </MenuItem>
        )
        }
        {
          currentUser._id !== _id && isAdmin && (
            <MenuItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { setSelectedRole('leave'); handleClose(); }}>
              <Typography variant='p'>Remove</Typography>
            </MenuItem>
          )
        }
      </Menu>
    </Box>
  )
}

export default SelectRole