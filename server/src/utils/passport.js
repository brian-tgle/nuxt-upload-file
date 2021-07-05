import { Strategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jsonwebtoken'
import { config, underscoreId } from '../config/index.js'
import db from '../models/index.js'

const User = db.users

export const applyPassportStrategy = passport => {
  const options = {}
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  options.secretOrKey = config.passport.secret
  passport.use(
    new Strategy(options, (payload, done) => {
      User.findOne({ _id: payload.userId }, (err, user) => {
        if (err) return done(err, false)
        if (user) {
          return done(null, {
            username: user.username,
            id: user[underscoreId]
          })
        }
        return done(null, false)
      })
    })
  )
}

export const verifyJwtToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded)
    })
  })
}

export const generateTokenAndRefresh = (payload, skipRefresh = false) => {
  // Access token
  const token = jwt.sign(payload, config.passport.secret,
    {
      expiresIn: config.passport.expiresIn
    })
  // Refresh token
  const refreshToken = skipRefresh
    ? null
    : jwt.sign(payload, config.passport.refreshTokenSecret, {
      expiresIn: config.passport.refreshTokenLife
    })
  return { token, refreshToken }
}

export const getJwtTokenFromHeader = (req, key) => {
  const tokenWithType = req.headers[key]
  const tokenArray = tokenWithType.split(' ')
  return tokenArray[1] ?? ''
}
