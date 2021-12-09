import { api } from 'boot/axios'

const user = {
  login: function (data) {
    return api.post('/login', data)
  },
  add: function (data) {
    return api.post('/api/v1/user', data)
  },
  update: function (data) {
    return api.put('/api/v1/user', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/user', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/user/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/user/list', { params })
  }
}

export { user }