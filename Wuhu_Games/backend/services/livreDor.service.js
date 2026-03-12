import { executeSQL } from "../database/db.js"

export async function getMessagesSQL(prestataireUsername) {
  const rows = await executeSQL(
    "SELECT * FROM livreDor WHERE prestataireUsername = ? ORDER BY createdAt ASC",
    [prestataireUsername]
  )
  return { error: 0, status: 200, data: rows }
}

export async function addMessageSQL(prestataireUsername, message) {
  await executeSQL(
    "INSERT INTO livreDor (prestataireUsername, message) VALUES (?, ?)",
    [prestataireUsername, message]
  )
  return { error: 0, status: 201, data: "Message ajouté" }
}

export async function deleteMessageSQL(id) {
  await executeSQL("DELETE FROM livreDor WHERE id = ?", [id])
  return { error: 0, status: 200, data: "Message supprimé" }
}