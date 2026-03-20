import { db, executeSQL } from "../database/db.js"

function enumerateDates(startDate, endDate) {
  const dates = []
  let current = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export async function getHotelAvailabilitySQL(prestataireUsername) {
  const rows = await executeSQL(
    `
    SELECT date, simpleAvailable, doubleAvailable, priceSimple, priceDouble
    FROM hotelAvailability
    WHERE prestataireUsername = ?
    ORDER BY date ASC
    `,
    [prestataireUsername]
  )

  return { error: 0, status: 200, data: rows }
}

export async function saveHotelAvailabilitySQL(prestataireUsername, availability) {
  await executeSQL("DELETE FROM hotelAvailability WHERE prestataireUsername = ?", [prestataireUsername])

  for (const item of availability) {
    await executeSQL(
      `
      INSERT INTO hotelAvailability
      (prestataireUsername, date, simpleAvailable, doubleAvailable, priceSimple, priceDouble)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        prestataireUsername,
        item.date,
        item.simpleAvailable ?? 0,
        item.doubleAvailable ?? 0,
        item.priceSimple ?? 0,
        item.priceDouble ?? 0
      ]
    )
  }

  return { error: 0, status: 200, data: "Disponibilites enregistrees" }
}

export async function createHotelReservationSQL(data) {
  const { prestataireUsername, username, roomType, startDate, endDate } = data

  if (!prestataireUsername || !username || !roomType || !startDate || !endDate) {
    return { error: 1, status: 400, data: "Parametres manquants" }
  }

  if (!["simple", "double"].includes(roomType)) {
    return { error: 1, status: 400, data: "Type de chambre invalide" }
  }

  const dates = enumerateDates(startDate, endDate)
  const nights = dates.length
  const stockColumn = roomType === "simple" ? "simpleAvailable" : "doubleAvailable"
  const priceColumn = roomType === "simple" ? "priceSimple" : "priceDouble"

  await db.beginTransaction()

  try {
    const placeholders = dates.map(() => "?").join(", ")
    const rows = await executeSQL(
      `
      SELECT date, ${stockColumn} AS stock, ${priceColumn} AS price
      FROM hotelAvailability
      WHERE prestataireUsername = ?
      AND date IN (${placeholders})
      FOR UPDATE
      `,
      [prestataireUsername, ...dates]
    )

    if (rows.length !== dates.length) {
      await db.rollback()
      return { error: 1, status: 400, data: "Certaines dates ne sont pas disponibles" }
    }

    const minStock = Math.min(...rows.map(row => row.stock))
    if (minStock < 1) {
      await db.rollback()
      return { error: 1, status: 409, data: "Plus de chambre disponible pour cette periode" }
    }

    const pricePerNight = rows[0]?.price ?? 0
    const totalPrice = pricePerNight * nights

    await executeSQL(
      `
      INSERT INTO hotelReservations
      (prestataireUsername, username, roomType, startDate, endDate, nights, pricePerNight, totalPrice, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
      `,
      [prestataireUsername, username, roomType, startDate, endDate, nights, pricePerNight, totalPrice]
    )

    for (const date of dates) {
      await executeSQL(
        `
        UPDATE hotelAvailability
        SET ${stockColumn} = ${stockColumn} - 1
        WHERE prestataireUsername = ? AND date = ?
        `,
        [prestataireUsername, date]
      )
    }

    await db.commit()

    return {
      error: 0,
      status: 201,
      data: {
        prestataireUsername,
        username,
        roomType,
        startDate,
        endDate,
        nights,
        pricePerNight,
        totalPrice
      }
    }
  } catch (err) {
    await db.rollback()
    throw err
  }
}
