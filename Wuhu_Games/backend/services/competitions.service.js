import { executeSQL } from "../database/db.js"

export async function getCompetitionsSQL() {
  const sql = "SELECT jour, heure, titre, lieu FROM competitions"
  const rows = await executeSQL(sql)
  return { error: 0, status: 200, data: rows }
}
