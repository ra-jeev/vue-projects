export default function ({ $axios, $auth }) {
  $axios.onError(async (error) => {
    console.log('axios onError: error: ', error)
    console.log('axios onError: error.response: ', error.response)
    const code = parseInt(error.response && error.response.status)
    const originalReq = error.config
    console.log('error code: ', code)
    if (code === 401 && !originalReq._retry) {
      originalReq._retry = true
      const res = await $auth.getSession()

      originalReq.headers.Authorization =
        'Bearer ' + res.getIdToken().getJwtToken()

      return $axios.request(originalReq)
    }

    return Promise.reject(error)
  })
}
