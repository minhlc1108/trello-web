import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import BoardList from './pages/Boards'
import Auth from '~/pages/Auth'
import VerifyAccount from './pages/Auth/VerifyAccount'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import PageNotFound from '~/pages/PageNotFound'
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/boards' element={<BoardList />} />
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/account/verification' element={<VerifyAccount/>} />
        <Route path='/*' element={<PageNotFound />} />
      </Routes >
    </Router >
  )
}

export default App
