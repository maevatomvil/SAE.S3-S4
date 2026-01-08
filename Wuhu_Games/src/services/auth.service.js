const useSQL = false

import LocalSource from "@/services/localsource.service.js"

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
  const sql = "SELECT username, email, role FROM users WHERE username = ? AND password = ?"
  const hashed = await hashPassword(data.password)
  const rows = await executeSQL(sql, [data.username, hashed])
  if (!rows.length) return { error: 1, status: 404, data: "login/password incorrect" }
  return { error: 0, status: 200, data: rows[0] }
}

async function signupFromSQL(data) {
  const hashed = await hashPassword(data.password)
  const sql = "INSERT INTO users (firstname, surname, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)"
  await executeSQL(sql, [data.firstname, data.surname, data.username, data.email, hashed, "visiteur"])
  return { error: 0, status: 200, data }
}

async function checkSessionFromSQL() {
  const current = JSON.parse(localStorage.getItem("currentUser") || "null")
  if (!current) return { error: 1, status: 401, data: "Non connecté" }
  const sql = "SELECT username FROM users WHERE username = ? AND session = ?"
  const rows = await executeSQL(sql, [current.username, current.session])
  if (!rows.length) return { error: 1, status: 401, data: "Session invalide" }
  return { error: 0, status: 200, data: current }
}

async function logoutFromSQL() {
  const current = JSON.parse(localStorage.getItem("currentUser") || "null")
  if (!current) return { error: 0, status: 200, data: "Déconnecté" }
  const sql = "UPDATE users SET session = NULL WHERE username = ?"
  await executeSQL(sql, [current.username])
  return { error: 0, status: 200, data: "Déconnecté" }
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
