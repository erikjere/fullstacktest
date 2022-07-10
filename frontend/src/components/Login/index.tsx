import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../Card'
import classes from './Login.module.css'

const Login: React.FC<{
  onLogin: (name: string) => void
}> = (props) => {
  const userRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const { onLogin } = props
  const [incorrectInput, setIncorrectInput] = useState(false)

  useEffect(() => {
    const loggedInCheck = async () => {
      if (document.cookie.startsWith('token=')) {
        const token = document.cookie.split('=')[1]
        console.log(token)
        const response = await fetch('http://localhost:5000/tokenLogin', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (data.status === 'login successful') {
          onLogin(data.data)
        }
      }
    }
    loggedInCheck()
  }, [onLogin])

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const user = {
      username: userRef.current!.value,
      password: passRef.current!.value,
    }

    // check if username and password match
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data === 'wrong username or password') {
      setIncorrectInput(true)
      console.log(data)
      return
    }

    //set cookie only if it contains a token
    setIncorrectInput(false)
    document.cookie = `token=${data}`
    onLogin(user.username)
  }

  return (
    <Card>
      <h2 className={classes.h2}>Login</h2>
      <form onSubmit={submitHandler} className={classes.form}>
        <label htmlFor="username">Username:</label>
        <input type="text" className={classes.input} ref={userRef} />
        <label htmlFor="password">Password:</label>
        <input type="password" className={classes.input} ref={passRef} />
        <input type="submit" value="Login" className={classes.button} />
      </form>
      {incorrectInput && (
        <p className={classes.invalid}>Wrong username or password</p>
      )}
      <p className={classes.register}>
        Don't have an account yet? <Link to="/register">Register!</Link>
      </p>
    </Card>
  )
}

export default Login
