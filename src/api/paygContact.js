import { api } from 'boot/axios'

const paygContact = {
  add: function (data) {
    return api.post('/api/v1/paygContact', data)
  },
  update: function (data) {
    return api.put('/api/v1/paygContact', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/paygContact', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/paygContact/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/paygContact/list', { params })
  },
}

export { paygContact }