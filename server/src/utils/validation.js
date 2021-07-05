import { check } from 'express-validator'
import passport from 'passport'
import {
  PASSWORD_IS_EMPTY,
  PASSWORD_LENGTH_MUST_BE_MORE_THAN_8,
  USERNAME_IS_EMPTY,
  EMPTY_FULLNAME
} from '../constants/index.js'
// ================================
// Validation:
// Handle all validation check for the server
// ================================
export const authorizeValidation = passport.authenticate('jwt', { session: false })

export const registerValidation = [
  check('username')
    .exists()
    .withMessage(USERNAME_IS_EMPTY),
  check('password')
    .exists()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({ min: 8 })
    .withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8),
  check('fullname')
    .exists()
    .withMessage(EMPTY_FULLNAME)
]

export const loginValidation = [
  check('username')
    .exists()
    .withMessage(USERNAME_IS_EMPTY),
  check('password')
    .exists()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({ min: 8 })
    .withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8)
]
