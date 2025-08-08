/* eslint-disable indent */
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import DoneIcon from '@mui/icons-material/Done';
import moment from 'moment';
import { CircularProgress } from '@mui/material';
import { deleteInvitation, selectCurrentNotifications, updateInvitation } from '~/redux/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BOARD_INVITATION_STATUS } from '~/utils/constants';
import { useNavigate } from 'react-router-dom';

function Notification({ newNotif, setNewNotif }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentNotifications = useSelector(selectCurrentNotifications);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setNewNotif(false);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (invite) => {
    await dispatch(updateInvitation({ inviteId: invite._id, data: { status: BOARD_INVITATION_STATUS.ACCEPTED } }))
    navigate(`/boards/${invite.boardId}`);
  };

  const handleReject = async (invite) => {
    dispatch(updateInvitation({ inviteId: invite._id, data: { status: BOARD_INVITATION_STATUS.REJECTED } }))
  }

  const handleDelete = async (invite) => {
    dispatch(deleteInvitation(invite._id))
  }

  return (
    <div>
      <Box
        id="notification-button"
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Tooltip title="Notifications">
          <Badge color="warning" variant={newNotif ? "dot" : "standard"} sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
      </Box>

      {anchorEl &&
        (
          <Menu
            id="notification-menu"
            aria-labelledby="notification-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <Typography variant='h6' sx={{ px: 2, color: "primary.main" }}>Notifications</Typography>
            {currentNotifications === null ? (
              <MenuItem><CircularProgress size={24} /></MenuItem>
            ) :
              currentNotifications.length === 0 ?
                <MenuItem sx={{ minWidth: '400px' }} disableTouchRipple>
                  <Box sx={{ width: '100%', textAlign: 'center', padding: 2 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      No notifications
                    </Typography>
                  </Box>
                </MenuItem>
                :
                currentNotifications.map((notification) => (
                  <MenuItem key={notification._id} sx={{ minWidth: '400px' }} disableTouchRipple>
                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 2 }}>
                      <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        <span style={{ fontWeight: 'bold' }}>{notification?.inviter?.displayName}</span> invite you to join board <span style={{ fontWeight: 'bold' }}>{notification?.board?.title}</span>
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {(() => {
                            switch (notification.status) {
                              case 'pending':
                                return (
                                  <>
                                    <Button className='interceptor-loading' variant="contained" color="success" size="small" onClick={() => { handleAccept(notification) }}>
                                      Accept
                                    </Button>
                                    <Button className='interceptor-loading' variant="outlined" color="error" size="small" onClick={() => { handleReject(notification) }}>
                                      Reject
                                    </Button>
                                  </>
                                )
                              case 'accepted':
                                return (
                                  <Chip
                                    label="Accepted"
                                    icon={<DoneIcon />}
                                    color="success"
                                    size="small"
                                  />
                                )
                              case 'rejected':
                                return (
                                  <Chip
                                    label="Rejected"
                                    icon={<NotInterestedIcon />}
                                    size="small"
                                  />
                                )
                              default:
                                return null
                            }
                          })()}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Tooltip title="Delete notification">
                            <IconButton className='interceptor-loading' aria-label="delete" onClick={() => { handleDelete(notification) }}>
                              <DeleteIcon sx={{ fontSize: 'medium' }} />
                            </IconButton>
                          </Tooltip>
                          <Typography variant='caption' sx={{ color: 'text.secondary', textAlign: 'right' }}>
                            {moment(notification.createdAt).format('llll')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </MenuItem>
                ))

            }
          </Menu>
        )}
    </div >
  )
}

export default Notification