import { executeSQL } from "../database/db.js"
import { hashPassword, comparePassword } from "../utils/hash.js"
import { createSessionToken } from "../utils/session.js"

export async function login(data) {
  const sql = "SELECT username, email, role, password FROM users WHERE username = ?"
  const rows = await executeSQL(sql, [data.username])

  if (!rows.length)
    return { error: 1, status: 404, data: "login/password incorrect" }

  const user = rows[0]
  const ok = await comparePassword(data.password, user.password)

  if (!ok)
    return { error: 1, status: 404, data: "login/password incorrect" }

  const session = createSessionToken()
  await executeSQL("UPDATE users SET session = ? WHERE username = ?", [session, user.username])

  delete user.password
  user.session = session

  return { error: 0, status: 200, data: user }
}

export async function signup(data) {
  const hashed = await hashPassword(data.password)
  const sql = "INSERT INTO users (firstname, surname, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)"
  await executeSQL(sql, [
    data.firstname,
    data.surname,
    data.username,
    data.email,
    hashed,
    "visiteur"
  ])

  return { error: 0, status: 200, data }
}

export async function checkSession(session) {
  const sql = "SELECT username FROM users WHERE username = ? AND session = ?"
  const rows = await executeSQL(sql, [session.username, session.session])

  if (!rows.length)
    return { error: 1, status: 401, data: "Session invalide" }

  return { error: 0, status: 200, data: session }
}

export async function logout(username) {
  const sql = "UPDATE users SET session = NULL WHERE username = ?"
  await executeSQL(sql, [username])

  return { error: 0, status: 200, data: "Déconnecté" }
}

export default {
  login,
  signup,
  checkSession,
  logout
}
