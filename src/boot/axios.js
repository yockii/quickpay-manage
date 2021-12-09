import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useQuasar } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '', timeout: 5000 });
const $q = useQuasar()

export default boot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  api.interceptors.request.use(config => {
    if (store.state.user.token) {
      config.headers['Authorization'] = 'Bearer ' + store.state.user.token
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
  api.interceptors.response.use(response => {
    if (response.status === 401) {
      $q.dialog('No Authorization')
      return
    }
    return response.data
  }, error => {
    return Promise.reject(error)
  })

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
