const useSQL = true

import LocalSource from "@/services/localsource.service.js"
import api from "@/services/axios.service.js"

async function loginFromLocalSource(data) {
  return LocalSource.login(data)
}

async function signupFromLocalSource(data) {
  return LocalSource.signup(data)
}

async function checkSessionFromLocalSource() {
  return LocalSource.checkSession()
}

async function logoutFromLocalSource() {
  return LocalSource.logout()
}

async function loginFromSQL(data) {
  const res = await api.post("/auth/login", data, {
    withCredentials: true
  })
  return res.data
}

async function signupFromSQL(data) {
  const res = await api.post("/auth/signup", data, {
    withCredentials: true
  })
  return res.data
}

async function checkSessionFromSQL() {
  const res = await api.get("/auth/session", {
    withCredentials: true
  })
  return res.data
}

async function logoutFromSQL() {
  const res = await api.post("/auth/logout", {}, {
    withCredentials: true
  })
  return res.data
}

export async function login(data) {
  if (!useSQL) {
    try { return await loginFromLocalSource(data) }
    catch { return { error: 1, status: 404, data: "erreur réseau, impossible de se connecter" } }
  }
  return await loginFromSQL(data)
}

export async function signup(data) {
  if (!useSQL) {
    try { return await signupFromLocalSource(data) }
    catch { return { error: 1, status: 500, data: "erreur réseau, impossible de créer le compte" } }
  }
  return await signupFromSQL(data)
}

export async function checkSession() {
  if (!useSQL) {
    try { return await checkSessionFromLocalSource() }
    catch { return { error: 1, status: 401, data: "erreur lors de la vérification de session" } }
  }
  return await checkSessionFromSQL()
}

export async function logout() {
  if (!useSQL) {
    try { return await logoutFromLocalSource() }
    catch { return { error: 1, status: 500, data: "erreur lors de la déconnexion" } }
  }
  return await logoutFromSQL()
}

export default {
  login,
  signup,
  checkSession,
  logout
}
