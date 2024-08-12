import AppBar from '~/components/AppBar/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PasswordIcon from '@mui/icons-material/Password'
import LockIcon from '@mui/icons-material/Lock'
import LockResetIcon from '@mui/icons-material/LockReset'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import TabPanel from '~/components/TabPanel'
import Avatar from '@mui/material/Avatar'
import { a11yProps } from '~/components/TabPanel'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, signOut } from '~/redux/slices/userSlice'
import { toast } from 'react-toastify'
import { update } from '~/redux/slices/userSlice'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

function User({ tab }) {
  const dispatch = useDispatch()
  let user = useSelector(selectCurrentUser)
  const { register: registerTabAccount, setValue, handleSubmit: handleTabAccount, formState: { isSubmitting, errors: errorsTabAccount } } = useForm({ defaultValues: { displayName: user.displayName } })
  const { register: registerTabSetting, watch, handleSubmit: handleTabSetting, formState: { errors: errorsTabSetting } } = useForm()

  const handleUpdate = async (data) => {
    const { displayName } = data
    await toast.promise(dispatch(update({ displayName: displayName.trim() })), {
      pending: 'Please wait...'
    }).then((res) => {
      if (!res.error) {
        toast.success('Update successfully!')
        setValue('displayName', res.payload?.displayName || user.displayName)
      }
    })
  }

  const handleChange = async (data) => {
    await toast.promise(dispatch(update(data)), {
      pending: 'Please wait...'
    }).then((res) => {
      if (!res.error) {
        toast.success('You change password successfully! You need to login again')
        dispatch(signOut())
      }
    })
  }

  const handleUpload = async (event) => {
    const data = new FormData()
    data.append('avatar', event.target.files[0])
    await toast.promise(dispatch(update(data)), {
      pending: 'Uploading...'
    }).then((res) => {
      if (!res.error) {
        toast.success('Upload avatar sucessfully!')
        event.target.value = ''
      }
    })
  }
  return (
    <>
      <AppBar />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} >
          <Tab icon={<AccountCircleIcon />} iconPosition="start" label='Account' {...a11yProps(0)} component={Link} to='/user/account' />
          <Tab icon={<ManageAccountsIcon />} iconPosition="start" label='Settings'{...a11yProps(1)} component={Link} to='/user/settings' />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <form onSubmit={handleTabAccount(handleUpdate)} style={{ width: '350px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 90, height: 90 }} src={user.avatar}></Avatar>
              <Button variant='contained' component='label' role={undefined} startIcon={<FileUploadIcon />} size='small'>
                Upload
                <VisuallyHiddenInput type='file' onChange={handleUpload} />
              </Button>
            </Box>
            <Box>
              <Typography variant='h6'>{user.displayName}</Typography>
              <Typography variant='p'>@{user.username}</Typography>
            </Box>
          </Box>
          <Box sx={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='Your email'
              value={user.email}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>
              }}
              fullWidth variant='filled' disabled />

            <TextField
              label='Your username'
              value={user.username}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>
              }}
              fullWidth variant='filled' disabled />

            <TextField
              {...registerTabAccount('displayName', { required: FIELD_REQUIRED_MESSAGE, minLength: { value: 3, message: 'Your display name must at least 3 characters!' } })}
              label='Your display name'
              InputProps={{
                startAdornment: <InputAdornment position="start"><AccountBoxIcon /></InputAdornment>
              }}
              fullWidth
              error={errorsTabAccount.displayName ? true : false} />
            {errorsTabAccount.displayName && <Alert severity='error'>{errorsTabAccount.displayName.message}</Alert>}
            <Button disabled={isSubmitting} variant='contained' type='submit' fullWidth>Update</Button>
          </Box>
        </form>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <form onSubmit={handleTabSetting(handleChange)} style={{ width: '350px' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant='h5'>Change Password</Typography>
            <TextField
              type='password'
              autoComplete='on'
              label='Your current password'
              InputProps={{
                startAdornment: <InputAdornment position="start"><PasswordIcon /></InputAdornment>
              }}
              fullWidth
              {...registerTabSetting('currentPassword', { required: FIELD_REQUIRED_MESSAGE })}
              error={errorsTabSetting.currentPassword ? true : false} />
            {errorsTabSetting.currentPassword && <Alert sx={{ width: '100%' }} severity='error'>{errorsTabSetting.currentPassword.message}</Alert>}
            <TextField
              type='password'
              autoComplete='on'
              label='New password'
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>
              }}
              fullWidth
              {...registerTabSetting('newPassword', {
                required: FIELD_REQUIRED_MESSAGE, pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              error={errorsTabSetting.newPassword ? true : false} />
            {errorsTabSetting.newPassword && <Alert sx={{ width: '100%' }} severity='error'>{errorsTabSetting.newPassword.message}</Alert>}
            <TextField
              type='password'
              autoComplete='on'
              label='Cofirm new password'
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockResetIcon /></InputAdornment>
              }}
              fullWidth
              {...registerTabSetting('confirmPassword', {
                validate: (val) => {
                  if (val !== watch('newPassword')) {
                    return 'Your passwords do not match'
                  }
                }
              })}
              error={errorsTabSetting.confirmPassword ? true : false} />
            {errorsTabSetting.confirmPassword && <Alert sx={{ width: '100%' }} severity='error'>{errorsTabSetting.confirmPassword.message}</Alert>}
            <Button variant='contained' type='submit' fullWidth>Change</Button>
          </Box>
        </form>
      </TabPanel>
    </>
  )
}

export default User