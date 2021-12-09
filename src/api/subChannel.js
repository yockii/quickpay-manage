import { api } from 'boot/axios'

const subChannel = {
  add: function (data) {
    return api.post('/api/v1/subChannel', data)
  },
  update: function (data) {
    return api.put('/api/v1/subChannel', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/subChannel', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/subChannel/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/subChannel/list', { params })
  }
}

export { subChannel }