import { executeSQL } from "../database/db.js"

export async function auth(req, res, next) {
  const session = req.headers["x-session"]

  if (!session)
    return res.status(401).json({ error: 1, data: "Session manquante" })

  const sql = "SELECT username, role FROM users WHERE session = ?"
  const rows = await executeSQL(sql, [session])

  if (!rows.length)
    return res.status(401).json({ error: 1, data: "Session invalide" })

  req.user = rows[0]
  next()
}
