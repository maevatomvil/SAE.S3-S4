import mysql from "mysql2/promise"

console.log("DB CONFIG USED BY BACKEND:", {
  host: "127.0.0.1",
  user: "root",
  password: "D3cjie0.",
  database: "wuhu"
})

export const db = await mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "D3cjie0.",
  database: "wuhu",
  socketPath: undefined
})

export async function executeSQL(sql, params = []) {
  const [rows] = await db.execute(sql, params)
  return rows
}
