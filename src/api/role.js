import { api } from 'boot/axios'

const role = {
  add: function (data) {
    return api.post('/api/v1/role', data)
  },
  update: function (data) {
    return api.put('/api/v1/role', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/role', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/role/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/role/list', { params })
  }
}

export { role }