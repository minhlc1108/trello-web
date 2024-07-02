import { Box, Button, Container, Alert, SvgIcon, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNewUserAPI } from '~/apis'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm({})
  const navigate = useNavigate()
  const handleSignUp = async (data) => {
    await toast.promise(createNewUserAPI({ email: data.email, password: data.password }), {
      pending: 'Register is in progress',
      success: {
        render: ({ data }) => {
          navigate({
            pathname: '/login',
            search: createSearchParams({
              registeredEmail: data.email
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

  return (
    <Container disableGutters maxWidth={false}
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/src/assets/background.jpg")',
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
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
            <SvgIcon component={TrelloIcon} inheritViewBox sx={{ width: '100%', height: '40px' }} />
            <Typography variant='h6'>Register</Typography>
          </Box>
          <form onSubmit={handleSubmit(handleSignUp)}>
            <TextField margin='dense' fullWidth label="Email" {...register('email', {
              required: 'This input is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address. (example@gmail.com)'
              }
            })} error={errors.email ? true : false} />
            {errors.email && <Alert severity="error">{errors.email.message}</Alert>}
            <TextField margin='dense' fullWidth type='password' label="Password" autoComplete='on' {...register('password', {
              required: 'This input is required',
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z]).{8,}$/i,
                message: 'At least 8 characters, must contain at least 1 letter and 1 number'
              }
            })} error={errors.password ? true : false} />
            {errors.password && <Alert severity="error">{errors.password.message}</Alert>}
            <TextField margin='dense' fullWidth type='password' label="Confirm Password" autoComplete='on' {...register('cfpassword', {
              validate: (val) => {
                if (val !== watch('password')) {
                  return 'Your passwords do not match'
                }
              }
            })} error={errors.cfpassword ? true : false} />
            {errors.cfpassword && <Alert severity="error">{errors.cfpassword.message}</Alert>}
            <Button disabled={isSubmitting} sx={{ marginTop: '10px', width: '100%' }} type='submit' variant='contained' size='large'>Sign up</Button>
          </form>
          <Link to='/login' style={{ marginTop: '10px', textDecoration: 'none', textAlign: 'center', color: '#1976d2' }}>You already have account? Log in</Link>
        </Box>
      </Box >
    </Container>
  )
}

export default Register