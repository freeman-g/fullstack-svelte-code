import axios from 'axios'

import createAuth0Client from '@auth0/auth0-spa-js'
import auth0Config from './auth0-config'

axios.interceptors.request.use(async (config) => {
  const auth0 = await createAuth0Client(auth0Config)
  const token = await auth0.getTokenSilently()
  config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export default axios
