import Box from '@mui/system/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      paddingX: 2,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2 '),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="MERN STACK Board"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspaces"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >Invite</Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://yt3.ggpht.com/yti/AGOGRCr6X5sBKPtPJZ5e9bPFEWkTDKX64WocLZ6zS1s6Vw=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-L6DYDB3WQ-ltV0OHiNXfM9FEAfUnhjgUaA&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe_2cZMKysro3YpIWasiWcKy8bk8bHLelR0g&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://png.pngtree.com/png-clipart/20211121/original/pngtree-funny-avatar-vector-icons-png-png-image_6948004.png" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1qm4wFghbqBE1Yp_yt_ExCO5uYfqs_z2MtQ&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-dSBRaoSO3rE0KJ1lb9bjuJUE1eayGbJJA&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSve1KURcIup7UuJVn0N1NbVv1bSDXLVKooXg&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://yt3.ggpht.com/yti/AGOGRCr6X5sBKPtPJZ5e9bPFEWkTDKX64WocLZ6zS1s6Vw=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-L6DYDB3WQ-ltV0OHiNXfM9FEAfUnhjgUaA&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe_2cZMKysro3YpIWasiWcKy8bk8bHLelR0g&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://png.pngtree.com/png-clipart/20211121/original/pngtree-funny-avatar-vector-icons-png-png-image_6948004.png" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1qm4wFghbqBE1Yp_yt_ExCO5uYfqs_z2MtQ&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-dSBRaoSO3rE0KJ1lb9bjuJUE1eayGbJJA&usqp=CAU" />
          </Tooltip>
          <Tooltip title='minh'>
            <Avatar alt="Minh Le" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSve1KURcIup7UuJVn0N1NbVv1bSDXLVKooXg&usqp=CAU" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
