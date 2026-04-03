import { executeSQL } from "../database/db.js"

export async function getViewsSQL(username) {
  const rows = await executeSQL(
    "SELECT date, count FROM views WHERE username = ?",
    [username]
  )
  return { error: 0, status: 200, data: rows }
}

export async function addViewSQL(username) {
  const today = new Date().toLocaleDateString()
  const existing = await executeSQL(
    "SELECT id FROM views WHERE username = ? AND date = ?",
    [username, today]
  )
  if (existing.length > 0) {
    await executeSQL(
      "UPDATE views SET count = count + 1 WHERE username = ? AND date = ?",
      [username, today]
    )
  } else {
    await executeSQL(
      "INSERT INTO views (username, date, count) VALUES (?, ?, 1)",
      [username, today]
    )
  }
  return { error: 0, status: 200 }
}

export async function getCommandesSQL(prestataireUsername) {
  const rows = await executeSQL(
    "SELECT commande FROM historique WHERE prestataireUsername = ?",
    [prestataireUsername]
  )
  return { error: 0, status: 200, data: rows.map(r => JSON.parse(r.commande)) }
}

export async function getHotelReservationsSQL(prestataireUsername) {
  const rows = await executeSQL(
    `
    SELECT
      reservationCode,
      username,
      roomType,
      DATE_FORMAT(startDate, '%Y-%m-%d') AS startDate,
      DATE_FORMAT(endDate, '%Y-%m-%d') AS endDate,
      nights,
      totalPrice,
      DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') AS createdAt
    FROM hotelReservations
    WHERE prestataireUsername = ?
    ORDER BY createdAt DESC
    `,
    [prestataireUsername]
  )

  return { error: 0, status: 200, data: rows }
}
