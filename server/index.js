const express = require('express')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

//JWT
const generateAccessToken = (username) => {
  return jwt.sign({ data: username }, process.env.TOKEN_SECRET, {
    expiresIn: 1800,
  })
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return
  // res.sendStauts(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err)
      return
    }

    req.user = user

    next()
  })
}

// postgress

const pgClient = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

pgClient.on('connect', (client) => {
  client
    .query(
      'CREATE TABLE IF NOT EXISTS users (user_ID SERIAL PRIMARY KEY,username varchar(45) UNIQUE NOT NULL, password varchar(45) NOT NULL);'
    )
    .catch((err) => console.log(err))
})

// express routes

// login
app.post('/login', (req, res) => {
  const { username, password } = req.body

  pgClient.query(
    'SELECT EXISTS(SELECT (username, password) FROM users WHERE username=($1) AND password=($2))',
    [username, password],
    (error, results) => {
      if (error) {
        console.log('problem:', error)
      }
      console.log(results.rows[0].exists)
      if (results.rows[0].exists) {
        const newToken = generateAccessToken(username)
        res.json(newToken)
      } else {
        res.json('wrong username or password')
      }
    }
  )
})

// token login
app.get('/tokenLogin', authenticateToken, (req, res) => {
  res.json({ status: 'login successful', ...req.user })
})

// sign up
app.post('/register', (req, res) => {
  const { username, password } = req.body

  pgClient.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, password],
    (error, results) => {
      if (error) {
        if (error.code === '23505') {
          res.json('username already exists')
        }
      }
      res.json('user added')
    }
  )
})

// delete user

app.post('/delete', authenticateToken, (req, res) => {
  const { data } = req.user

  pgClient.query('DELETE FROM users WHERE username=($1)'),
    [data],
    (error, results) => {}
})

// change password

app.post('/updatePassword', authenticateToken, (req, res) => {
  const { data } = req.user
  const newPassword = req.headers['newpassword']

  pgClient.query('UPDATE users SET password=($1) WHERE username=($2)'),
    [newPassword, data],
    (error, results) => {}
})

// get beer list

app.get('/beerList', authenticateToken, (req, res) => {
  const pageNumber = req.headers['pagenumber']
  res.json(`https://api.punkapi.com/v2/beers?page=${pageNumber}`)
})

app.listen(5000, (err) => {
  console.log('Listening')
})
