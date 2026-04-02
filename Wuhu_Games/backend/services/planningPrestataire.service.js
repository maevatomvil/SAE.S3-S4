import { executeSQL } from "../database/db.js"
import { generateReservationCode } from "../utils/reservationCode.js"

export async function inscrireSQL(data) {
  const { prestataireUsername, eventId, username } = data
  let numero, rows
  do {
    numero = generateReservationCode()
    rows = await executeSQL(
      "SELECT numero FROM planningPrestataire WHERE numero = ?",
      [numero]
    )
  } while (rows.length > 0)

  await executeSQL(
    "INSERT INTO planningPrestataire (prestataireUsername, eventId, username, numero) VALUES (?, ?, ?, ?)",
    [prestataireUsername, eventId, username, numero]
  )
  return { error: 0, status: 201, data: numero }
}

export async function desinscrireSQL(data) {
  const { prestataireUsername, eventId, username } = data
  await executeSQL(
    "DELETE FROM planningPrestataire WHERE prestataireUsername = ? AND eventId = ? AND username = ?",
    [prestataireUsername, eventId, username]
  )
  return { error: 0, status: 200, data: "Désinscrit" }
}

export async function getNumeroSQL(prestataireUsername, eventId, username) {
  const rows = await executeSQL(
    "SELECT numero FROM planningPrestataire WHERE prestataireUsername = ? AND eventId = ? AND username = ? LIMIT 1",
    [prestataireUsername, eventId, username]
  )
  if (rows.length === 0) return { error: 0, status: 200, data: null }
  return { error: 0, status: 200, data: rows[0].numero }
}

export async function getInscriptionsSQL(prestataireUsername, eventId) {
  const rows = await executeSQL(
    "SELECT username, numero FROM planningPrestataire WHERE prestataireUsername = ? AND eventId = ?",
    [prestataireUsername, eventId]
  )
  return { error: 0, status: 200, data: rows }
}
