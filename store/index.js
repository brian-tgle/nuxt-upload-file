import Cookie from 'js-cookie'
const cookieparser = process.server ? require('cookieparser') : undefined

/**
 * Declare all state variable.
 */
export const state = () => ({
  auth: null
})
export const mutations = {
  /**
   * Save token after authen successful.
   * @param {*} state
   * @param {*} auth
   */
  setAuth (state, auth) {
    Cookie.set('auth', auth)
    state.auth = auth
  }
}
/**
 * All global actions.
 */
export const actions = {
  /**
   * Get token saved in cookie when init server.
   * @param {*} param0
   * @param {*} param1
   */
  nuxtServerInit ({ commit }, { req }) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setAuth', auth)
  }
}
