import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import BoardList from '~/pages/Boards'
import Auth from '~/pages/Auth'
import VerifyAccount from '~/pages/Auth/VerifyAccount'
import User from '~/pages/User'
import NotFound from '~/pages/NotFound'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '~/redux/slices/userSlice'
import ProtectedRoute from '~/components/ProtectedRoute/ProtectedRoute'
function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={isAuthenticated ?
          <Navigate to='/boards/6658b2bbefe6fa78ac4369d0' replace={true} />
          : <Navigate to='/login' replace={true} />
        } />
        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/account/verification' element={<VerifyAccount />} />

        <Route path='/user/account' element={
          <ProtectedRoute>
            <User tab={0} />
          </ProtectedRoute>
        } />

        <Route path='/user/settings' element={
          <ProtectedRoute>
            <User tab={1} />
          </ProtectedRoute>
        } />

        <Route path='/boards' element={
          <ProtectedRoute>
            <BoardList />
          </ProtectedRoute>
        } />

        <Route path='/boards/:boardId' element={
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        } />

        <Route path='/*' element={<NotFound />} />
      </Routes >
    </Router >
  )
}

export default App
