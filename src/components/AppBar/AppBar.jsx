import { useEffect, useState } from 'react'
import Box from '@mui/system/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/mdi--trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import InputAdornment from '@mui/material/InputAdornment'
import { Link } from 'react-router-dom'
import ModalCreateBoard from '~/components/ModalCreateBoard/ModalCreateBoard'
import Notification from '~/components/Notification/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification, fetchNotifications } from '~/redux/slices/notificationSlice'
import socket from '~/utils/socket'
import { selectCurrentUser } from '~/redux/slices/userSlice'

function AppBar() {
  const [openModal, setOpenModal] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const [searchValue, setSearchValue] = useState('')
  const [newNotif, setNewNotif] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchNotifications())
    socket.on('s_receiveInvites', (invitations) => {
      const invitation = invitations.find(invite => invite.inviteeId === currentUser._id)
      if (invitation) {
        dispatch(addNotification(invitation))
        setNewNotif(true)
      }
    })

  }, [dispatch, currentUser])
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      paddingX: 2,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0 '),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
        <AppsIcon sx={{ color: 'white' }} />
        <Box as={Link} to='/boards' sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5, ':hover': { cursor: 'pointer' } }}>
          <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }} />
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
        </Box>
        <Button sx={{ color: 'white' }} startIcon={<LibraryAddIcon />} onClick={() => setOpenModal(true)}>Create</Button>
        <ModalCreateBoard open={openModal} handleClose={() => setOpenModal(false)} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          value={searchValue}
          size='small'
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon fontSize='small'
                  sx={{ color: 'white', cursor: 'pointer', display: searchValue ? 'block' : 'none' }}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
        <ModeSelect />
        <Notification newNotif={newNotif} setNewNotif={setNewNotif} />
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profiles />
      </Box>

    </Box>
  )
}

export default AppBar
