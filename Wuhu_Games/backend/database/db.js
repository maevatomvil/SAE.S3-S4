import mysql from "mysql2/promise"

console.log("DB CONFIG USED BY BACKEND:", {
  host: "localhost",
  user: "root",
  password: ".",
  database: "wuhu"
})

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ".",
  database: "wuhu"
})

export async function executeSQL(sql, params = []) {
  const [rows] = await db.execute(sql, params)
  return rows
}
