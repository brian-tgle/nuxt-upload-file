import express from 'express'
import db from '../models/index.js'
import uploadFile from '../middleware/upload.js'
import { authorizeValidation } from '../utils/validation.js'
import { UPLOAD_FOLDER } from '../constants/index.js'

const fileController = express.Router()

const File = db.files

const getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? (page - 1) * limit : 0

  return { limit, offset }
}

const createFile = (originalName, url) => {
  const data = {
    originalName,
    url
  }
  return new File(data).save()
}

fileController.post('/', authorizeValidation, async (req, res) => {
  try {
    await uploadFile(req, res)
    const { filename, originalname } = req?.file
    const { id } = req?.user
    await createFile(originalname, `${UPLOAD_FOLDER}/${id}/${filename}`)
    res.status(200).json({
      success: true,
      message: 'Uploaded the file successfully'
    })
  } catch (err) {
    console.log(err)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).json({
        success: false,
        message: 'File size cannot be larger than 2MB!'
      })
    }

    res.status(500).json({
      success: false,
      message: `Could not upload the file: ${req.file.originalname}. ${err}`
    })
  }
})

fileController.get('/', authorizeValidation, async (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  const sort = { updatedAt: -1 }
  File.paginate({}, { offset, limit, sort }).then(data => {
    res.status(200).json({
      success: true,
      totalItems: data.totalDocs,
      data: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1
    })
  }).catch((err) => {
    res.status(500).json({
      success: false,
      message:
        err.message || 'Some error occurred while retrieving files.'
    })
  })
})

fileController.get('/:userFolder/:name', async (req, res) => {
  const { userFolder, name } = req.params
  res.download(`${__basedir}/${UPLOAD_FOLDER}/${userFolder}/${name}`, name, (err) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Could not download the file. ' + err
      })
    }
  })
})
export default fileController
