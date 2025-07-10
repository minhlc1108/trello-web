import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import TitleIcon from '@mui/icons-material/Title'
import DescriptionIcon from '@mui/icons-material/Description'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { createNewBoardAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

function ModalCreateBoard({ open, handleClose }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm()
  const navigate = useNavigate()

  const createNewBoard = async (data) => {
    await createNewBoardAPI({ ...data, title: data.title.trim(), description: data.description.trim() }).then(res => {
      handleClose()
      navigate(`/boards/${res._id}`)
      reset()
    })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Create new board
        </Typography>
        <IconButton color='error' onClick={handleClose} sx={{ position: 'absolute', top: '4px', right: '4px' }}>
          <CloseIcon />
        </IconButton>
        <form onSubmit={handleSubmit(createNewBoard)}>
          <TextField
            {...register('title', { required: FIELD_REQUIRED_MESSAGE, minLength: { value: 3, message:'At least 3 characters' } })}
            margin='dense'
            label="Title"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon />
                </InputAdornment>
              )
            }}
            fullWidth
            variant="outlined"
          />
          {errors.title && <Alert severity='error'>{errors.title.message}</Alert>}
          <TextField
            {...register('description', { required: FIELD_REQUIRED_MESSAGE, minLength: { value: 3, message:'At least 3 characters' } })}
            margin='dense'
            label="Description"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              )
            }}
            fullWidth
            variant="outlined"
          />
          {errors.description && <Alert severity='error'>{errors.description.message}</Alert>}
          <FormControl sx={{ paddingLeft: '14px' }} fullWidth margin='dense'>
            <FormLabel>Type</FormLabel>
            <RadioGroup
              row
              defaultValue={BOARD_TYPES.PRIVATE}
            >
              <FormControlLabel {...register('type')} value={BOARD_TYPES.PRIVATE} control={<Radio />} label="Private" />
              <FormControlLabel {...register('type')} value={BOARD_TYPES.PUBLIC} control={<Radio />} label="Public" />
            </RadioGroup>
          </FormControl>
          <Button disabled={isSubmitting} variant="contained" sx={{ float: 'right' }} type='submit'>Create</Button>
        </form>

      </Box>

    </Modal>
  )
}

export default ModalCreateBoard