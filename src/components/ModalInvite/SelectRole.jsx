import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/slices/userSlice'
import { selectBoard, updateMembers } from '~/redux/slices/boardSlice'
import { BOARD_ROLES } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
import { changeRoleAPI, leaveBoardAPI, removeMemberAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'

function SelectRole({ role, _id }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedRole, setSelectedRole] = React.useState(role)
  const currentUser = useSelector(selectCurrentUser)
  const currentBoard = useSelector(selectBoard)
  const open = Boolean(anchorEl)
  const confirm = useConfirm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setSelectedRole(role)
  }, [role])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isMember = currentBoard.memberIds.includes(currentUser._id)
  const isAdmin = currentBoard.ownerIds.includes(currentUser._id)
  const isLastAdmin = currentBoard.ownerIds.length === 1 && currentBoard.ownerIds[0] === _id

  const handleChooseAdmin = async () => {
    if (selectedRole === BOARD_ROLES.ADMIN) {
      handleClose();
      return;
    }
    if (currentBoard.ownerIds.includes(_id)) {
      handleClose();
      return;
    }
    await changeRoleAPI(currentBoard._id, _id, BOARD_ROLES.ADMIN)
    setSelectedRole(BOARD_ROLES.ADMIN);
    dispatch(updateMembers({ role: BOARD_ROLES.ADMIN, userId: _id }))
    handleClose();
  }

  const handleChooseMember = async () => {
    if (selectedRole === BOARD_ROLES.MEMBER) {
      handleClose();
      return;
    }

    await changeRoleAPI(currentBoard._id, _id, BOARD_ROLES.MEMBER)
    dispatch(updateMembers({ role: BOARD_ROLES.MEMBER, userId: _id }))
    setSelectedRole(BOARD_ROLES.MEMBER);
    handleClose();
  }

  const handleLeaveBoard = () => {
    confirm({
      confirmationText: 'Yes',
      title: 'Leave board',
      description: 'Are you sure?'
    }).then(async () => {
      await leaveBoardAPI(currentBoard._id)
      dispatch(updateMembers({ role: null, userId: _id }))

      navigate('/boards')
      handleClose();
    }).catch()

  }

  const handleRemoveMember = () => {
    confirm({
      confirmationText: 'Yes',
      title: 'Remove member from board',
      description: 'Are you sure?'
    }).then(async () => {
      await removeMemberAPI(currentBoard._id, _id)
      dispatch(updateMembers({ role: null, userId: _id }))
      handleClose();
    }).catch()
  }

  return (
    <Box>
      <Button
        sx={{ color: theme => theme.palette.mode === 'dark' ? "#fff" : "#0c66e4", backgroundColor: theme => theme.palette.mode === "dark" ? "rgb(144 202 249 / 8%)" : "#e9f2ff" }}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        {selectedRole === BOARD_ROLES.ADMIN ? 'Admin' : selectedRole === BOARD_ROLES.MEMBER ? 'Member' : ''}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disabled={isMember} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { handleChooseAdmin() }}>
          <Typography variant='p'>Admin</Typography>
        </MenuItem>
        <MenuItem disabled={isMember || isLastAdmin} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { handleChooseMember() }}>
          <Typography variant='p'>Member</Typography>
          {isLastAdmin && <span style={{ fontSize: '12px', color: 'gray' }}>Board must have at least one admin.</span>}
        </MenuItem>
        {currentUser._id === _id && (
          <MenuItem disabled={isLastAdmin} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { handleLeaveBoard() }}>
            <Typography variant='p'>Leave</Typography>
            {isLastAdmin && <span style={{ fontSize: '12px', color: 'gray' }}>Board must have at least one admin.</span>}
          </MenuItem>
        )
        }
        {
          currentUser._id !== _id && isAdmin && (
            <MenuItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onClick={() => { handleRemoveMember() }}>
              <Typography variant='p'>Remove</Typography>
            </MenuItem>
          )
        }
      </Menu>
    </Box>
  )
}

export default SelectRole