const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const feedbackRoutes = require('./routes/feedbackRoutes')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const mongoUri = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'Feedback Admin backend running' })
})

app.use('/api/feedbacks', feedbackRoutes)

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message || 'Server error' })
})

async function startServer() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required in backend/.env')
  }

  await mongoose.connect(mongoUri)
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
