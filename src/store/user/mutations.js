export function SET_TOKEN(state, token) {
  state.token = token
}
export function SET_USER(state, user) {
  state.user = user
}
export function SET_RESOURCE_INFO(state, { isSuper, resources }) {
  state.isSuper = isSuper || false
  state.resources = resources || []
}