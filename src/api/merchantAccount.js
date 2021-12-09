import { api } from 'boot/axios'

const merchantAccount = {
  add: function (data) {
    return api.post('/api/v1/merchantAccount', data)
  },
  update: function (data) {
    return api.put('/api/v1/merchantAccount', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/merchantAccount', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/merchantAccount/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/merchantAccount/list', { params })
  }
}

export { merchantAccount }