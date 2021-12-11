export function setToken({ commit }, token) {
  commit('SET_TOKEN', token)
}
export function setUser({ commit }, user) {
  commit('SET_USER', user)
}
export function setResources({ commit }, data) {
  commit('SET_RESOURCE_INFO', data)
}