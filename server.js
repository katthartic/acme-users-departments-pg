const express = require('express')
const app = express()
const db = require('./db')
const path = require('path')

// MIDDLEWARE
app.use(express.json())
app.use((req, res, next) => {
  console.log(`HITTING: ${req.url} - ${req.method}`)
  next()
})

//ROUTES
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/api/departments', async (req, res, next) => {
  try {
    res.send(await db.findAllDepartments())
  } catch (ex) {
    next(ex)
  }
})

app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await db.findAllUsers())
  } catch (ex) {
    next(ex)
  }
})

//SYNC DB & LISTEN ON PORT
const port = process.env.PORT || 3000
db.sync().then(() => {
  app.listen(port, () => console.log(`LISTENING on port ${port}`))
})
