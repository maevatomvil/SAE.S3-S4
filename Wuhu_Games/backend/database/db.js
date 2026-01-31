import mysql from "mysql2/promise"

export const db = await mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ""
})

export async function executeSQL(sql, params = []) {
  const [rows] = await db.execute(sql, params)
  return rows
}
