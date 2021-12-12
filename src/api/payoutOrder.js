import { api } from 'boot/axios'

const payoutOrder = {
  add: function (data) {
    return api.post('/api/v1/payoutOrder', data)
  },
  update: function (data) {
    return api.put('/api/v1/payoutOrder', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/payoutOrder', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/payoutOrder/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/payoutOrder/list', { params })
  }
}

export { payoutOrder }