export function saveToken(token: string) {
  localStorage.setItem("token", token)
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
}

export function getToken() {
  return localStorage.getItem("token")
}

export function removeToken() {
  localStorage.removeItem("token")
  document.cookie = "token=; path=/; max-age=0"
}

export function isAuthenticated() {
  return !!localStorage.getItem("token")
}