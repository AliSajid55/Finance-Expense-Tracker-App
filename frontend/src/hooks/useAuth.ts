import api from "../lib/api"
import { saveToken, removeToken } from "../lib/auth"


export async function login(email: string, password: string) {
  const params = new URLSearchParams()
  params.append("username", email)
  params.append("password", password)

  const res = await api.post("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  const token = res.data.access_token
  saveToken(token)
  return res.data
}

export function logout() {
  removeToken()
  window.location.href = "/login"
}

export async function signup(data: {
  email: string
  password: string
  full_name: string
}) {
  return api.post("/auth/signup", data)
}

export async function getProfile() {
  const res = await api.get("/users/me")
  return res.data.data
}

