import util from 'util'
import fs from 'fs'
import multer from 'multer'
import { UPLOAD_FOLDER, MAX_UPLOAD_SIZE } from '../constants/index.js'

const storage = multer.diskStorage({
  destination: (req, __, cb) => {
    const path = `${__basedir}${UPLOAD_FOLDER}/${req?.user?.id}`
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }
    cb(null, path)
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const uploadFile = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE }
}).single('file')

const uploadFileMiddleware = util.promisify(uploadFile)
export default uploadFileMiddleware
