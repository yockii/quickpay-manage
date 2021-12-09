import { api } from 'boot/axios'

const dict = {
  add: function (data) {
    return api.post('/api/v1/dict', data)
  },
  update: function (data) {
    return api.put('/api/v1/dict', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/dict', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/dict/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/dict/list', { params })
  }
}

export { dict }