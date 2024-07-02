import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verificationAccount } from '~/apis'

function VerifyAccount() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  useEffect(() => {
    const params = Object.fromEntries(searchParams)
    toast.promise(verificationAccount(params), {
      success: {
        render: ({ data }) => {
          navigate({
            pathname: '/login',
            search: createSearchParams({
              verifiedEmail: params.email
            }).toString()
          })
          return data.message
        }
      },
      error: {
        render: ({ data }) => {
          return data.response.data.message || data.message
        }
      }
    })
  }, [searchParams])

  return (
    <Box sx={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2
    }}>
      <CircularProgress />
      <Typography variant='p'>Verifing Account...</Typography>
    </Box>
  )
}

export default VerifyAccount