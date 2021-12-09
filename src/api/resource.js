import { api } from 'boot/axios'

const resource = {
  add: function (data) {
    return api.post('/api/v1/resource', data)
  },
  update: function (data) {
    return api.put('/api/v1/resource', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/resource', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/resource/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/resource/list', { params })
  }
}

export { resource }