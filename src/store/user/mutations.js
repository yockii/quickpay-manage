export function SET_TOKEN(state, token) {
  window.sessionStorage.setItem('token', token)
  state.token = token
}
export function SET_USER(state, user) {
  window.sessionStorage.setItem('user', JSON.stringify(user))
  state.user = user
}
