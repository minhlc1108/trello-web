import { Box, Button, Container, Alert, SvgIcon, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNewUserAPI } from '~/apis'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({})
  const navigate = useNavigate()
  const handleSignUp = async (data) => {
    const { email, password } = data
    await toast.promise(createNewUserAPI({ email: email.toLowerCase(), password }), {
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
            <Typography variant='h6'>Register</Typography>
          </Box>
          <form onSubmit={handleSubmit(handleSignUp)}>
            <TextField margin='dense' fullWidth label="Email" {...register('email', {
              required: 'This input is required',
              pattern: {
                value: EMAIL_RULE,
                message: EMAIL_RULE_MESSAGE
              }
            })} error={errors.email ? true : false} />
            {errors.email && <Alert severity="error">{errors.email.message}</Alert>}
            <TextField margin='dense' fullWidth type='password' label="Password" autoComplete='on' {...register('password', {
              required: 'This input is required',
              pattern: {
                value: PASSWORD_RULE,
                message: PASSWORD_RULE_MESSAGE
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