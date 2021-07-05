import sha256 from 'sha256'

export const generateHashedPassword = password => sha256(password)

export function generateServerErrorCode (res, code, fullError, msg, location = 'server') {
  const errors = {}
  errors[location] = {
    fullError,
    msg
  }
  return res.status(code).json({
    code,
    fullError,
    errors
  })
}

export function generateExprireDatetime (afterCurrent = 5) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + afterCurrent)
  return new Date(now)
}

export function checkExpiredToken (expiredTokenTimeString) {
  const now = new Date()
  const expiredTokenTime = new Date(expiredTokenTimeString)
  if (now.getTime() > expiredTokenTime.getTime()) {
    return true
  } return false
}
