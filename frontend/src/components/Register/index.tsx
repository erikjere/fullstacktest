import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Card from '../Card'
import classes from './Register.module.css'

const Register: React.FC<{ isLoggedIn: boolean }> = (props) => {
  const userRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const [isUsernameTaken, setIsUsernameTaken] = useState(false)
  const navigate = useNavigate()

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const user = {
      username: userRef.current!.value,
      password: passRef.current!.value,
    }

    // store data in database
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data === 'username already exists') {
      setIsUsernameTaken(true)
    } else {
      navigate('/login', { replace: true })
    }
  }

  return (
    <Card>
      <h2 className={classes.h2}>Register</h2>
      <form onSubmit={submitHandler} className={classes.form}>
        <label htmlFor="username">Username:</label>
        <input type="text" className={classes.input} ref={userRef} />
        <label htmlFor="password">Password:</label>
        <input type="password" className={classes.input} ref={passRef} />
        <input type="submit" value="Register" className={classes.button} />
      </form>
      {isUsernameTaken && (
        <p className={classes.taken}>This username is already taken..</p>
      )}
      <p className={classes.login}>
        Already have an account? <Link to="/login">Login!</Link>
      </p>
    </Card>
  )
}

export default Register
