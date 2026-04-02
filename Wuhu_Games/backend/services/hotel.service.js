import { db, executeSQL } from "../database/db.js"
import { generateReservationCode } from "../utils/reservationCode.js"

function enumerateDates(startDate, endDate) {
  const dates = []
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number)
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number)
  let current = new Date(Date.UTC(startYear, startMonth - 1, startDay))
  const end = new Date(Date.UTC(endYear, endMonth - 1, endDay))

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10))
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return dates
}

export async function getHotelAvailabilitySQL(prestataireUsername) {
  const rows = await executeSQL(
    `
    SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, simpleAvailable, doubleAvailable, priceSimple, priceDouble
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
      SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, ${stockColumn} AS stock, ${priceColumn} AS price
      FROM hotelAvailability
      WHERE prestataireUsername = ?
      AND date IN (${placeholders})
      FOR UPDATE
      `,
      [prestataireUsername, ...dates]
    )

    if (rows.length !== dates.length) {
      await db.rollback()
      const foundDates = rows.map(row => row.date)
      const missingDates = dates.filter(date => !foundDates.includes(date))
      return {
        error: 1,
        status: 400,
        data: `Certaines dates ne sont pas disponibles : ${missingDates.join(", ")}`
      }
    }

    const minStock = Math.min(...rows.map(row => row.stock))
    if (minStock < 1) {
      await db.rollback()
      return { error: 1, status: 409, data: "Plus de chambre disponible pour cette periode" }
    }

    const pricePerNight = rows[0]?.price ?? 0
    const totalPrice = pricePerNight * nights
    const reservationCode = generateReservationCode()

    await executeSQL(
      `
      INSERT INTO hotelReservations
      (prestataireUsername, username, reservationCode, roomType, startDate, endDate, nights, pricePerNight, totalPrice, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
      `,
      [prestataireUsername, username, reservationCode, roomType, startDate, endDate, nights, pricePerNight, totalPrice]
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
        totalPrice,
        reservationCode
      }
    }
  } catch (err) {
    await db.rollback()
    if (err?.code === "ER_DUP_ENTRY") {
      return {
        error: 1,
        status: 409,
        data: "Vous avez déjà réservé cette chambre pour cette période"
      }
    }
    throw err
  }
}
