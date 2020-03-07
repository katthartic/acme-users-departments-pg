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

//SYNC DB & LISTEN ON PORT
const port = process.env.PORT || 3000
db.sync().then(() => {
  app.listen(port, () => console.log(`LISTENING on port ${port}`))
})
