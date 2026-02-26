

import { executeSQL } from "../database/db.js"

export async function getPrestatairesValidesSQL() {
  const sql = "SELECT * FROM templates WHERE type = 'prestataireValide'"
  const result = await executeSQL(sql)
  return { error: 0, status: 200, data: result }
}
