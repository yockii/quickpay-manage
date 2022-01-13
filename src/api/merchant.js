import { api } from 'boot/axios'

const merchant = {
  add: function (data) {
    return api.post('/api/v1/merchant', data)
  },
  update: function (data) {
    return api.put('/api/v1/merchant', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/merchant', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/merchant/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/merchant/list', { params })
  },
  payoutReconciliation: function (id) {
    return api.put(`/api/v1/merchant/payoutReconciliation/${id}`)
  },
  incr: function (data) {
    return api.put('/api/v1/merchant/incr', data)
  },
}

export { merchant }