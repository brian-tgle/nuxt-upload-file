import { ROUTES, TOKEN_TYPE, UNAUTHORIZED, INTERNAL_ERROR } from '../constants'

export default function ({ $axios, redirect, store }) {
  if (store.state.auth) {
    // Get token when reload app and data available in store
    const token = store.state.auth.token
    $axios.setToken(token, TOKEN_TYPE)
  }
  $axios.onError(error => {
    if (error.response.status === INTERNAL_ERROR) {
      // redirect('/sorry')
      // TODO: Show application alert
    }
    return error
  })
  $axios.onResponse(result => {
    const status = result?.response?.status
    if (status === UNAUTHORIZED) {
      // Refresh token when access token was expired
      return $axios.post('/auth/refresh', {
        refreshToken: store.state.auth.refreshToken
      }).then(async (response) => {
        // Get new token after refresh
        const { data } = response.data

        // Update auth object in store
        const newAuthObject = { ...store.state.auth, token: data.token }
        store.commit('setAuth', newAuthObject)

        // Update token in axios header
        await $axios.setToken(data.token, TOKEN_TYPE)

        // Get original request
        const originalRequest = result?.config
        // Update new token in original request
        originalRequest.headers.Authorization = `${TOKEN_TYPE} ${data.token}`
        // Fire an original request again
        // In that case, the request will wait for new call with alive access token.
        return $axios.request(originalRequest)
      }).catch(() => {
        // Remove auth data in store
        store.commit('setAuth', null)

        // Removes default Authorization header from `common` scope all requests
        $axios.setToken(false)

        // Redirect to login in case refresh token was expired
        redirect(ROUTES.LOGIN)
      })
    }
    return result
  })
}
