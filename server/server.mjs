import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index.mjs'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Praagma'],
    credentials: true
  })
)

app.use(cookieParser())
app.use(express.json())

app.use('/api', router)

const connectDB = async () => {
  mongoose.set('strictQuery', true)
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Connected to MongoDB successfully')
  } catch (error) {
    console.error('Failed to connect to MongoDB', error)
    process.exit(1)
  }
}

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start the server', error)
  }
}

startServer()
