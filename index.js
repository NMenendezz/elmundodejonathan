import { errorHandler } from './server/middleware/errorHandler.js'
import categoryRouter from './server/routes/category.js'
import corsOptions from './server/config/corsOptions.js'
import authRouter from './server/routes/auth.js'
import postRouter from './server/routes/post.js'
import { logger } from './server/middleware/logger.js'
import connectDB from './server/config/connectDB.js'
import express, { json } from 'express'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'
import dotenv from 'dotenv';
import cors from 'cors'
import path from 'path'

dotenv.config();

//connectDB()

const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY)

const BASEURL = process.env.BASEURL
const PORT = process.env.PORT || 3001
const __dirname = path.dirname(fileURLToPath(import.meta.url))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
})

const app = express()

app.disable('x-powered-by')

app.use(logger)
app.use(express.json())
// app.use(json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(errorHandler)

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/categories', categoryRouter)

app.use(express.static(path.resolve(__dirname, './client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
})

app.all('*', errorHandler)

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('App launched 🚀')
  } else {
    console.log(`App started at ${BASEURL}:${PORT}`)
  }
})
