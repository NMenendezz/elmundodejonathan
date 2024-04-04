import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import { existsSync } from 'node:fs'
import { mkdir, appendFile } from 'node:fs/promises'
import path, { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!existsSync(join(__dirname, '..', 'logs'))) {
      await mkdir(join(__dirname, '..', 'logs'))
    }
    await appendFile(join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (err) {
    console.log(err)
  }
}

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method} ${req.path}`)
  next()
}
