import { api } from 'boot/axios'

const odinmoSender = {
  add: function (data) {
    return api.post('/api/v1/odinmoSender', data)
  },
  update: function (data) {
    return api.put('/api/v1/odinmoSender', data)
  },
  delete: function (id) {
    return api.delete('/api/v1/odinmoSender', {
      params: { id }
    })
  },
  get: function (params) {
    return api.get('/api/v1/odinmoSender/instance', { params })
  },
  paginate: function (params) {
    return api.get('/api/v1/odinmoSender/list', { params })
  },
}

export { odinmoSender }