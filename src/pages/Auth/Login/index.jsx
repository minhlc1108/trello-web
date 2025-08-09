/* eslint-disable indent */
import { Box, Button, Container, Alert, SvgIcon, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchUserAPI } from '~/apis'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { signIn } from '~/redux/slices/userSlice'
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
function Login() {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  useEffect(() => {
    (async () => {
      for (const entry of searchParams.entries()) {
        const [key, value] = entry
        if (key !== 'registeredEmail' && key !== 'verifiedEmail') { continue }
        if (EMAIL_RULE.test(value)) {
          const user = await fetchUserAPI(value)
          switch (key) {
            case 'registeredEmail':
              if (user && !user.isActive) {
                setIsRegistered(true)
              }
              break
            case 'verifiedEmail':
              if (user && user.isActive) {
                setIsVerified(true)
              }
              break
            default:
              break
          }
        }
      }
    })()

  }, [searchParams])

  const handleSignIn = async (data) => {
    const { email, password } = data
    await toast.promise(dispatch(signIn({ email: email.toLowerCase(), password })), { pending: 'Log in...' })
  }

  return (
    <Container disableGutters maxWidth={false}
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/background.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
      <Box sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{
          minWidth: '350px',
          maxWidth: '350px',
          borderRadius: 1,
          padding: '16px 20px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#4b4953' : 'white'),
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox sx={{ width: '100%', height: '40px' }} />
            <Typography variant='h6'>Login</Typography>
          </Box>
          {isRegistered && <Alert severity="info">An email has been sent to <b>{searchParams.get('registeredEmail')}</b><br></br> Please check and verify your account before logging in</Alert>}
          {isVerified && <Alert severity="success">Your email <b>{searchParams.get('verifiedEmail')}</b> has been verified.<br></br> Now you can log in to use this app</Alert>}
          <form onSubmit={handleSubmit(handleSignIn)}>
            <TextField margin='dense' fullWidth label="Email" {...register('email', { required: FIELD_REQUIRED_MESSAGE })} error={errors.email ? true : false} />
            {errors.email && <Alert severity="error">{errors.email.message}</Alert>}
            <TextField margin='dense' fullWidth type='password' label="Password" autoComplete='on' {...register('password', { required: FIELD_REQUIRED_MESSAGE })} error={errors.password ? true : false} />
            {errors.password && <Alert severity="error">{errors.password.message}</Alert>}
            <Button disabled={isSubmitting} sx={{ marginTop: '10px', width: '100%' }} type='submit' variant='contained' size='large'>Login</Button>
          </form>
          <Link to='/register' style={{ marginTop: '10px', textDecoration: 'none', textAlign: 'center', color: '#1976d2' }}>Create new account</Link>
        </Box>
      </Box >
    </Container>
  )
}

export default Login