import { useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'

function LabelEditable({ value, onChangedValue, inputFontSize = '16px', ...props }) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef(null)
  const triggerBlur = () => {
    if (!inputValue || inputValue.trim() === value || inputValue.trim().length < 3 || inputValue.trim().length > 50) {
      return
    }
    onChangedValue(inputValue)
  }
  useEffect(() => {
    setInputValue(value)
  }, [value])
  return (
    <TextField
      inputRef={inputRef}
      id="toggle-focus-input-controlled"
      fullWidth
      variant='outlined'
      size="small"
      value={inputValue}
      onChange={(event) => { setInputValue(event.target.value) }}
      onBlur={triggerBlur}
      {...props}
      data-no-dnd="true"
      sx={{
        '& label': {},
        '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
          '& fieldset': { borderColor: 'primary.main' }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }}
      error={inputValue.trim().length < 3 || inputValue.trim().length > 50}
      helperText={inputValue.trim().length < 3 ? 'Title must be at least 3 characters long' : inputValue.trim().length > 50 ? 'Title not longer than 50 characters' : ''} />
  )
}

export default LabelEditable
