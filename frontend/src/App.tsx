import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import classes from './App.module.css'
import BeerList from './components/BeerList'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const loginHandler = (name: string, page: number = 1) => {
    setUsername(name)
    setIsLoggedIn(true)
    navigate(`/beers/${page}`, { replace: true })
  }

  const logoutHandler = () => {
    setUsername('')
    setIsLoggedIn(false)
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
  }

  return (
    <div className={classes.app}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={loginHandler} />} />
        <Route
          path="/register"
          element={<Register isLoggedIn={isLoggedIn} />}
        />
        <Route path="/beers" element={<Navigate to="/beers/1" />} />
        <Route
          path="/beers/:pageNumber"
          element={
            <BeerList
              onLogin={loginHandler}
              onLogout={logoutHandler}
              isLoggedIn={isLoggedIn}
              username={username}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
