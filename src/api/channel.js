import { api } from 'boot/axios'

const channel = {
  add: function (data) {
    return api.post('/api/v1/channel', data)
  },
  update: function (data) {
    return api.put('/api/v1/channel', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/channel', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/channel/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/channel/list', { params })
  },
  payoutReconciliation: function (id) {
    return api.put(`/api/v1/channel/payoutReconciliation/${id}`)
  }
}

export { channel }