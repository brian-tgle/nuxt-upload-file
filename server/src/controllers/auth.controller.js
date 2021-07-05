import express from 'express'
import { validationResult } from 'express-validator'
import db from '../models/index.js'
import { generateTokenAndRefresh, getJwtTokenFromHeader } from '../utils/passport.js'
import {
  checkExpiredToken,
  generateExprireDatetime,
  generateHashedPassword,
  generateServerErrorCode
} from '../utils/index.js'
import {
  registerValidation,
  loginValidation,
  authorizeValidation
} from '../utils/validation.js'
import {
  SOME_THING_WENT_WRONG,
  USER_EXISTS_ALREADY,
  WRONG_PASSWORD,
  USER_DOES_NOT_EXIST
} from '../constants/index.js'

const User = db.users
const UserRefreshToken = db.userRefreshTokens

const authController = express.Router()

const createUser = (username, password, fullname) => {
  const data = {
    username,
    password: generateHashedPassword(password),
    fullname
  }
  return new User(data).save()
}

const createRefreshToken = (refreshToken, token, createdBy) => {
  const data = {
    refreshToken,
    token,
    createdBy,
    expiresIn: generateExprireDatetime() // Generate refresh token expired after 5 minutes
  }
  return new UserRefreshToken(data).save()
}

/**
 * POST/
 * Register a user
 */
authController.post('/register', registerValidation, async (req, res) => {
  const errorsAfterValidation = validationResult(req)
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json({
      code: 400,
      errors: errorsAfterValidation.mapped()
    })
  }
  try {
    const { username, password, fullname } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      await createUser(username, password, fullname)
      const newUser = await User.findOne({ username })
      delete newUser.hashedPassword
      res.status(200).json(userToReturn)
    } else {
      generateServerErrorCode(res, 403, 'register username error', USER_EXISTS_ALREADY, 'username')
    }
  } catch (e) {
    generateServerErrorCode(res, 500, e, SOME_THING_WENT_WRONG)
  }
})
/**
 * POST/
 * Login a user
 */
authController.post('/login', loginValidation, async (req, res) => {
  const errorsAfterValidation = validationResult(req)
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json({
      code: 400,
      errors: errorsAfterValidation.mapped()
    })
  }
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (user && user.username) {
    const isPasswordMatched = user.comparePassword(password)
    if (isPasswordMatched) {
      const userId = user.id
      const { refreshToken, token } = generateTokenAndRefresh({ userId })
      // Save refresh token into DB
      await createRefreshToken(refreshToken, token, userId)
      // Create user object with token and refresh token
      const userToReturn = { ...user.toJSON(), ...{ token, refreshToken } }
      delete userToReturn.password
      return res.status(200).json({ data: userToReturn, success: true })
    } else {
      generateServerErrorCode(res, 403, 'login password error', WRONG_PASSWORD, 'password')
    }
  } else {
    generateServerErrorCode(res, 404, 'login username error', USER_DOES_NOT_EXIST, 'username')
  }
})

authController.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  const token = getJwtTokenFromHeader(req, 'authorization')
  if (refreshToken) {
    try {
      // await verifyJwtToken(refreshToken, config.passport.refreshTokenSecret)
      const responseRefreshToken = await UserRefreshToken.findOne({ token, refreshToken })
      if (responseRefreshToken) {
        if (!checkExpiredToken(responseRefreshToken.expiresIn)) {
          const tokenGenerated = generateTokenAndRefresh({ userId: responseRefreshToken.createdBy }, true)
          responseRefreshToken.token = tokenGenerated.token
          responseRefreshToken.expiresIn = generateExprireDatetime()
          // Update new access token
          await responseRefreshToken.save()
          res.status(200).json({
            success: true,
            data: {
              token: tokenGenerated.token
            }
          })
        } else {
          // Remove refresh token
          await responseRefreshToken.remove()
          res.status(401).json({
            success: false,
            message: 'Token expired, please try to login again'
          })
        }
      } else {
        res.status(403).json({
          success: false,
          message: 'Invalid refresh token'
        })
      }
    } catch (err) {
      res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid request'
    })
  }
})
authController.post('/logout', authorizeValidation, (req, res) => {
  const token = getJwtTokenFromHeader(req, 'authorization')
  const user = req.user
  UserRefreshToken.deleteOne({ createdBy: user.id, token }, (error, data) => {
    if (error) {
      res.status(403).json({
        success: false,
        message: 'Invalid token'
      })
    } else {
      req.logout()
      res.status(200).json({
        success: true,
        data: null
      })
    }
  })
})
export default authController
