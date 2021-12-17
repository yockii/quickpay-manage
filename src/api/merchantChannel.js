import { api } from 'boot/axios'

const merchantChannel = {
  add: function (data) {
    return api.post('/api/v1/merchantChannel', data)
  },
  update: function (data) {
    return api.put('/api/v1/merchantChannel', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/merchantChannel', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/merchantChannel/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/merchantChannel/list', { params })
  },
  incr: function (data) {
    return api.put('/api/v1/merchantChannel/incr', data)
  },
  testFee: function (params) {
    return api.get('/api/v1/merchantChannel/testFee', { params })
  }
}

export { merchantChannel }