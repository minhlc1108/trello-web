import React, { useRef, useState } from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

function LabelEditable({ title }) {
  const [label, setLabel] = useState(title)
  const [isEditing, setIsEditing] = useState(false)
  const ref = useRef(title)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleChange = (e) => {
    setLabel(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (!label.trim()) {
      setLabel(ref.current)
    }
  }

  return (
    <>
      {isEditing ? (
        <TextField
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          variant='outlined'
          size='small'
          autoFocus
          sx={{
            '& .MuiOutlinedInput-input': {
              fontSize: '1rem',
              fontWeight: 'bold',
              width: '240px',
              paddingX: '6px'
            }
          }}
          data-no-dnd="true"
        >
        </TextField>

      ) : (
        <Typography noWrap variant='h6'
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '240px',
            height: 'fit-content',
            paddingX: '6px'
          }}
          onClick={handleEditClick}
        >
          {label}
        </Typography>
      )}
    </>
  )
}

export default LabelEditable