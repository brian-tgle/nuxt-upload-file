export default $axios => resource => ({
  login (credential) {
    return $axios.$post(`${resource}/login`, credential)
  },

  logout () {
    return $axios.$post(`${resource}/logout`)
  },

  getAll (page, size) {
    return $axios.get(`${resource}?page=${page}&size=${size}`)
  },

  upload (payload) {
    return $axios.post(`${resource}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  download (name) {
    return $axios.get(`${resource}/${name}`)
  }
})
