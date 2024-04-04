import mongoose from 'mongoose'
import { logEvents } from '../middleware/logger.js'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (error) {
    console.error(`error: ${error.message}`)
    process.exit(1)
  }
}

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  )
})

export default connectDB
