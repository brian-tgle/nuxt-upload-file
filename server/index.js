import express from 'express'
import bodyParser from 'body-parser'
import { dirname } from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import { config } from './src/config/index.js'
import { applyPassportStrategy } from './src/utils/passport.js'
import { fileURLToPath } from 'url'
import authController from './src/controllers/auth.controller.js'
import fileController from './src/controllers/file.controller.js'
import db from './src/models/index.js'

dotenv.config()

const app = express()
applyPassportStrategy(passport)
const corsOptions = {
  origin: config.corsOptions.origin
}
app.use(cors(corsOptions))
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
global.__basedir = __dirname

app.use(express.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

db.mongoose
  .connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch((error) => {
    console.log('Cannot connect to the database!', error)
    process.exit()
  })

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kinobi File management app.' })
})
app.use('/api/auth', authController)
app.use('/api/files', fileController)

const port = config.env.port
app.listen(port, () => {
  console.log(`Running at localhost:${port}`)
})
