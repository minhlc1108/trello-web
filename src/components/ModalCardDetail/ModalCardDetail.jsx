import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import LabelEditable from "~/components/LabelEditable/LabelEditable";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Button from "@mui/material/Button";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Divider from "@mui/material/Divider";
import CardUserGroup from "./CardUserGroup";
import CardDescriptionMdEditor from "./CardDescriptionMdEditor";
import CardActivitySection from "./CardActivitySection";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentActiveCard, selectCurrentActiveCard, updateCurrentActiveCard } from "~/redux/slices/activeCardSlice";
import { selectCurrentUser } from "~/redux/slices/userSlice";
import { selectBoard, updateCardInBoard } from "~/redux/slices/boardSlice";
import { updateCardDetailsAPI } from "~/apis";
import { toast } from "react-toastify";
import { CARD_MEMBERS_ACTION } from "~/utils/constants";

const SidebarItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  color: theme.palette.mode === "dark" ? "#90caf9" : "#172b4d",
  backgroundColor: theme.palette.mode === "dark" ? "#2f3542" : "#091e420f",
  padding: "10px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#33485D" : theme.palette.grey[300],
    "&.active": {
      color: theme.palette.mode === "dark" ? "#000000de" : "#0c66e4",
      backgroundColor: theme.palette.mode === "dark" ? "#90caf9" : "#e9f2ff"
    },
    "&.active.remove": {
      color: theme.palette.mode === "dark" ? "#000000de" : "#d80000",
      backgroundColor: theme.palette.mode === "dark" ? "#ffb3b3" : "#ffc9c9"
    }
  },
  "&.disabled": {
    opacity: 0.5,
    pointerEvents: "none",
    cursor: "not-allowed"
  }
}));

function ModalCardDetail() {
  const [isOpen, setIsOpen] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const dispatch = useDispatch()
  const currentActiveCard = useSelector(selectCurrentActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const currentBoard = useSelector(selectBoard)
  const handleCloseModal = () => {
    setIsOpen(false)
    dispatch(clearCurrentActiveCard())
  }

  const handleTitleChange = async (newTitle) => {
    await updateCardDetailsAPI(currentActiveCard._id, { boardId: currentActiveCard.boardId, title: newTitle.trim() })
    dispatch(updateCurrentActiveCard({ ...currentActiveCard, title: newTitle.trim() }))
    dispatch(updateCardInBoard({ ...currentActiveCard, title: newTitle.trim() }))
  }

  const handleUploadCover = async (event) => {
    const formData = new FormData()
    setIsUploading(true)
    formData.append('cover', event.target.files[0])
    formData.append('boardId', currentActiveCard.boardId)
    await toast.promise(updateCardDetailsAPI(currentActiveCard._id, formData), {
      pending: 'Uploading...'
    }).then((res) => {
      if (!res.error) {
        toast.success('Upload cover successfully!')
        event.target.value = ''
        dispatch(updateCurrentActiveCard({ ...currentActiveCard, cover: res.cover }))
        dispatch(updateCardInBoard({ ...currentActiveCard, cover: res.cover }))
      }
    }).finally(() => setIsUploading(false))
  }

  const handleUpdateMembers = async (userId, action) => {
    const res = await updateCardDetailsAPI(currentActiveCard._id, {
      boardId: currentActiveCard.boardId,
      incomingMember: {
        userId,
        action
      }
    })
    if (!res.error) {
      let members = []
      if (Array.isArray(res.memberIds) && res.memberIds.length > 0) {
        res.memberIds.forEach(memberId => {
          const member = [...currentBoard.members, ...currentBoard.owners].find(m => m._id === memberId)
          if (member) {
            members.push(member)
          }
        })
      }
      res.members = members
      dispatch(updateCurrentActiveCard({ ...currentActiveCard, memberIds: res.memberIds, members: res.members }))
      dispatch(updateCardInBoard({ ...currentActiveCard, memberIds: res.memberIds, members: res.members }))
      if (userId !== currentUser._id) {
        toast.info(`You ${action === CARD_MEMBERS_ACTION.JOIN ? 'added' : 'removed'} ${[...currentBoard.members, ...currentBoard.owners].find(m => m._id === userId)?.displayName} to the card!`)
      } else {
        toast.success(`You ${action === CARD_MEMBERS_ACTION.JOIN ? 'joined' : 'left'} the card successfully!`)
      }
    }
  }
  return (
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
        {currentActiveCard.cover && <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              minHeight: "116px",
              height: "160px",
              maxHeight: "160px",
              backgroundImage:
                `url(${currentActiveCard.cover})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "#262e37"
                  : "rgb(228, 228, 228)",
            }}
          ></Box>
          <Button
            disabled={isUploading}
            startIcon={<CenterFocusWeakIcon />}
            size="medium"
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              margin: 1.5
            }}
            component="label"
          >
            Cover
            <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleUploadCover} />
          </Button>
        </Box>}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: "16px 52px 0 16px",
            mb: 1,
            gap: 1
          }}
        >
          <CreditCardIcon />
          <LabelEditable inputFontSize="22px" value={currentActiveCard?.title} onChangedValue={handleTitleChange}></LabelEditable>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3, px: 2 }}>
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}
              >
                Members
              </Typography>
              <CardUserGroup members={currentActiveCard?.members} handleUpdateMembers={handleUpdateMembers} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <SubjectOutlinedIcon />
                <Typography
                  variant="span"
                  sx={{ fontWeight: "600", fontSize: "20px" }}
                >
                  Description
                </Typography>
              </Box>
              <CardDescriptionMdEditor card={currentActiveCard} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <ListOutlinedIcon />
                <Typography
                  variant="span"
                  sx={{ fontWeight: "600", fontSize: "20px" }}
                >
                  Activity
                </Typography>
              </Box>
              <CardActivitySection card={currentActiveCard} />
            </Box>
          </Grid>

          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              {(Array.isArray(currentActiveCard?.memberIds) && currentActiveCard?.memberIds?.includes(currentUser._id)) ? (
                <SidebarItem className="active remove" onClick={() => { handleUpdateMembers(currentUser._id, CARD_MEMBERS_ACTION.LEAVE) }}>
                  <PersonRemoveOutlinedIcon fontSize="small" />
                  Leave
                </SidebarItem>
              ) : (
                <SidebarItem className="active" onClick={() => { handleUpdateMembers(currentUser._id, CARD_MEMBERS_ACTION.JOIN) }}>
                  <PersonAddOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              )}
              <SidebarItem>
                <SellOutlinedIcon fontSize="small" />
                Labels
              </SidebarItem>
              <SidebarItem>
                <CheckBoxOutlinedIcon fontSize="small" />
                Checklist
              </SidebarItem>
              <SidebarItem>
                <AccessTimeOutlinedIcon fontSize="small" />
                Dates
              </SidebarItem>
              <SidebarItem>
                <AttachmentOutlinedIcon fontSize="small" />
                Attachment
              </SidebarItem>
              <SidebarItem className={`active ${isUploading ? 'disabled' : ''}`} component="label">
                <CenterFocusWeakIcon fontSize="small" />
                Cover
                <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleUploadCover} />
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}
            >
              Power-Ups
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <AddOutlinedIcon fontSize="small" />
                Add Power-Ups
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography
              sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}
            >
              Automation
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <AddOutlinedIcon fontSize="small" />
                Add button
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography
              sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}
            >
              Actions
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <ArrowForwardOutlinedIcon fontSize="small" />
                Move
              </SidebarItem>
              <SidebarItem>
                <ContentCopyOutlinedIcon fontSize="small" />
                Copy
              </SidebarItem>
              <SidebarItem>
                <AutoAwesomeOutlinedIcon fontSize="small" />
                Make Template
              </SidebarItem>
              <SidebarItem>
                <ArchiveOutlinedIcon fontSize="small" />
                Archive
              </SidebarItem>
              <SidebarItem>
                <ShareOutlinedIcon fontSize="small" />
                Share
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ModalCardDetail;
