let token = window.sessionStorage.getItem('token')
let user = {}
try {
  user = JSON.parse(window.sessionStorage.getItem('user'))
} catch (e) {
  token = ""
}

export default function () {
  return {
    token: token,
    user: user
  }
}
