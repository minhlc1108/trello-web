import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect } from 'react'
import { Navigate, createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verificationAccount } from '~/apis'

function VerifyAccount() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { email, token } = Object.fromEntries(searchParams)

  const navigate = useNavigate()
  useEffect(() => {
    if (email && token) {
      toast.promise(verificationAccount({ email, token }), {
        success: {
          render: ({ data }) => {
            navigate({
              pathname: '/login',
              search: createSearchParams({
                verifiedEmail: email
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
    }
  }, [email, token, navigate])

  if (!email || !token) {
    return <Navigate to="/404" replace={true} />
  }

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