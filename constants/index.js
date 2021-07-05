export const API_ENDPOINT = 'http://localhost:5000/api'

export const ALERT_TYPES = {
  SUCCESS: {
    open: true,
    type: 'success',
    message: 'Upload file successully'
  },
  FAILED: {
    open: true,
    type: 'error',
    message: 'Failed while uploading file to server. Please try again!'
  },
  HIDDEN: {
    open: false,
    type: '',
    message: ''
  }
}

export const UNAUTHORIZED = 401

export const INTERNAL_ERROR = 500

export const TOKEN_TYPE = 'Bearer'

export const ROUTES = {
  LOGIN: '/login',
  BASE: '/'
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  SIZE: 5
}
