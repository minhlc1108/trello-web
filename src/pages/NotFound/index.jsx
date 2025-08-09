import { Box, Typography, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { Link } from 'react-router-dom'
function PageNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 4,
        textAlign: 'center'
      }}
    >
      <Typography variant="h1" sx={{
        fontWeight: 700, background: 'url(/textbg.jpg)',
        backgroundSize: 'cover',
        WebkitTextFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text'
      }} > Oops! 404</Typography>
      <Typography variant='h2' sx={{ fontWeight: 500 }}>Look like you&apos;re lost</Typography>
      <Typography variant='p'>the page you are looking for not avaible!</Typography>
      <Link to={'/'}>
        <Button variant="outlined" size='large' startIcon={<HomeIcon />}>Go Home</Button>
      </Link>
    </Box>
  )
}

export default PageNotFound