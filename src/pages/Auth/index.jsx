import { Navigate, useLocation } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '~/redux/slices/userSlice'

function Auth() {
  const location = useLocation()
  const loginMode = location.pathname === '/login'
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to='/' replace={true} />
  }

  return (
    loginMode ? <Login /> : <Register />
  )
}

export default Auth