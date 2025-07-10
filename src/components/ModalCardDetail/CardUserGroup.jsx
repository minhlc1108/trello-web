import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import Popover from '@mui/material/Popover'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useState } from "react";
import { selectBoard } from "~/redux/slices/boardSlice";
import { useSelector } from "react-redux";
import { CARD_MEMBERS_ACTION } from "~/utils/constants";

function CardUserGroup({ members, handleUpdateMembers }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const board = useSelector(selectBoard)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'user-group-popover' : undefined;

  return (
    <Box sx={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {members?.map((member, index) => (
        <Tooltip title={member.name} key={index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: "pointer" }}
            alt={member.name}
            src={member.avatar}
          />
        </Tooltip>
      ))}
      <Tooltip title="Add new member">
        <Box
          sx={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontSize: "14px",
            fontWeight: 600,
            color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
            }
          }}
          onClick={handleClick}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {[...board.owners, ...board.members].map((member, index) =>
            <Tooltip title={member.name} key={index}>
              {/* Cách làm Avatar kèm badge icon: https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: 'pointer' }}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent= {members?.some(m => m._id === member._id) ? <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} /> : null}
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt={member.name}
                  src={member.avatar}
                  onClick={() => {
                    members?.some(m => m._id === member._id) ? handleUpdateMembers(member._id, CARD_MEMBERS_ACTION.LEAVE) : handleUpdateMembers(member._id, CARD_MEMBERS_ACTION.JOIN)
                  }}
                />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  );
}

export default CardUserGroup;
