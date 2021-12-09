import { api } from 'boot/axios'

const payOrder = {
  add: function (data) {
    return api.post('/api/v1/payOrder', data)
  },
  update: function (data) {
    return api.put('/api/v1/payOrder', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/payOrder', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/payOrder/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/payOrder/list', { params })
  }
}

export { payOrder }