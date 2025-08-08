import { Autocomplete, Avatar, Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import CloseIcon from "@mui/icons-material/Close";
import SelectRole from './SelectRole';
import { useDebounce } from '~/hooks/useDebounce';
import { inviteMemberToBoardAPI, searchUserAPI } from '~/apis';
import { useSelector } from 'react-redux';
import { selectBoard } from '~/redux/slices/boardSlice';
import { selectCurrentUser } from '~/redux/slices/userSlice';
import { toast } from 'react-toastify';
import { BOARD_ROLES } from '~/utils/constants';
import socket from '~/utils/socket';

const ModalInvite = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [inviteeMembers, setInviteeMembers] = useState([])
  const [result, setResult] = useState(null)
  const [isOpenSearch, setIsOpenSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const currentBoard = useSelector(selectBoard)
  const currentUser = useSelector(selectCurrentUser)

  const handleCloseModal = () => {
    setIsOpen(false)
  }
  const handleInvite = async () => {
    setIsInviting(true)
    const inviteeIds = inviteeMembers.map(member => member._id)
    inviteMemberToBoardAPI({ boardId: currentBoard._id, inviteeIds }).then((res) => {
      const invitations = res.filter(invite => invite.status === 201).map(invite => (invite.data))
      socket.emit('c_receiveInvites', invitations)
    }).finally(() => {
      setIsInviting(false)
    })
    setInviteeMembers([])
    toast.success('Invite sent successfully!')
  }

  useEffect(() => {
    if (!isOpenSearch) setResult(null)
  }, [isOpenSearch])

  const debounceSearchValue = useDebounce((event) => {
    const searchValue = event.target.value
    if (searchValue && searchValue.trim() !== '') {
      setIsLoading(true)
      searchUserAPI(searchValue.trim()).then((data) => {
        setResult(data)
      }).finally(() => {
        setIsLoading(false)
      })
    } else {
      setResult(null)
    }
  }, 1000)
  return (
    <>
      {currentBoard.role !== null &&
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          onClick={() => setIsOpen(true)}
        >Invite</Button>
      }
      <Modal
        open={isOpen}
        onClose={handleCloseModal}
        disableScrollLock
        sx={{ overflowY: "auto" }}
      >
        <Box
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: 900,
            boxShadow: 24,
            borderRadius: "8px",
            border: "none",
            outline: 0,
            margin: "50px auto",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1A2027" : "#fff"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "12px",
              right: "10px",
              cursor: "pointer",
              zIndex: 1
            }}
          >
            <CloseIcon
              color="error"
              sx={{ "&:hover": { color: "error.light" } }}
              onClick={handleCloseModal}
            />
          </Box>
          <Box sx={{ textAlign: "left", p: "12px 16px" }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', color: theme => theme.palette.mode === 'dark' ? "#fff" : "#0c66e4" }}>Share board</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              p: "16px",
              gap: 1
            }}
          >
            <Autocomplete
              multiple
              limitTags={5}
              open={isOpenSearch}
              onClose={() => setIsOpenSearch(false)}
              onOpen={() => setIsOpenSearch(true)}
              value={inviteeMembers}
              onChange={(event, newValue) => {
                setInviteeMembers(newValue);
              }}
              renderInput={(params) =>
                <TextField {...params} placeholder="Enter email to invite" onChange={debounceSearchValue}
                />
              }
              options={result || []}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              getOptionLabel={(option) => option.email}
              getOptionDisabled={(option) =>
                [...currentBoard.owners, ...currentBoard.members].some(
                  (member) => member._id === option._id
                )
              }
              noOptionsText={!result ? "Type email to invite" : "No users found"}
              sx={{ flex: 1 }}
              loading={isLoading}
              renderOption={(props, option) => {
                const { ...optionProps } = props;
                return (
                  <li {...optionProps} key={option._id} >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={option.avatar}
                        alt={option.displayName}
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{option.displayName}</span>
                        <span style={{ color: 'gray' }}>{option.email}</span>
                      </Box>
                    </Box>
                  </li>
                )
              }}

            />
            <Button
              variant="contained"
              disabled={inviteeMembers?.length === 0 || isInviting}
              onClick={handleInvite}
            >
              {isInviting && <CircularProgress size={24} />} Invite</Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pb: 2 }}>
            <Typography variant='h7' sx={{ px: 2, fontWeight: 'bold', color: theme => theme.palette.mode === 'dark' ? "#fff" : "#0c66e4" }}>
              Members
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[...currentBoard.ownerIds, ...currentBoard.memberIds].includes(currentUser._id) && <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    style={{ width: 50, height: 50, borderRadius: '50%' }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{currentUser.displayName} (you)</span>
                    <span style={{ color: 'gray' }}>@{currentUser.username}</span>
                  </Box>
                </Box>

                <SelectRole _id={currentUser._id} role={currentBoard.owners.some(user => user._id === currentUser._id) ? BOARD_ROLES.ADMIN : BOARD_ROLES.MEMBER} />
              </Box>
              }

              {[...currentBoard.owners, ...currentBoard.members].filter(member => member._id !== currentUser._id).map((member) => (
                <Box key={member._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={member.avatar}
                      alt={member.displayName}
                      style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{member.displayName}</span>
                      <span style={{ color: 'gray' }}>@{member.username}</span>
                    </Box>
                  </Box>

                  <SelectRole _id={member._id} role={currentBoard.owners.some(user => user._id === member._id) ? BOARD_ROLES.ADMIN : BOARD_ROLES.MEMBER} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default ModalInvite