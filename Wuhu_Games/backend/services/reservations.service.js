import { db, executeSQL } from "../database/db.js"

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

function parseMaybeJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export async function getUserReservationsSQL(username) {
  const competitionRows = await executeSQL(
    `
    SELECT i.titre, i.jour, i.heure, i.numero, c.lieu
    FROM inscriptions i
    LEFT JOIN competitions c
      ON c.titre = i.titre AND c.jour = i.jour AND c.heure = i.heure
    WHERE i.username = ?
    ORDER BY i.jour, i.heure
    `,
    [username]
  )
  const spectatorRows = await executeSQL(
    `
    SELECT s.titre, s.jour, s.heure, s.numero, c.lieu
    FROM spectateurs s
    LEFT JOIN competitions c
      ON c.titre = s.titre AND c.jour = s.jour AND c.heure = s.heure
    WHERE s.username = ?
    ORDER BY s.jour, s.heure
    `,
    [username]
  )
  const planningRows = await executeSQL(
    `
    SELECT pp.id, pp.prestataireUsername, pp.eventId, pp.numero, t.name, t.planning
    FROM planningPrestataire pp
    LEFT JOIN templates t ON t.username = pp.prestataireUsername AND t.type = 'prestataireValide'
    WHERE pp.username = ?
    ORDER BY pp.id DESC
    `,
    [username]
  )
  const hotelRows = await executeSQL(
    `
    SELECT hr.id, hr.prestataireUsername, hr.reservationCode, hr.roomType,
           DATE_FORMAT(hr.startDate, '%Y-%m-%d') AS startDate,
           DATE_FORMAT(hr.endDate, '%Y-%m-%d') AS endDate,
           hr.nights, hr.pricePerNight, hr.totalPrice, hr.status, t.name
    FROM hotelReservations hr
    LEFT JOIN templates t ON t.username = hr.prestataireUsername AND t.type = 'prestataireValide'
    WHERE hr.username = ?
    ORDER BY hr.createdAt DESC
    `,
    [username]
  )
  const orderRows = await executeSQL(
    `
    SELECT id, prestataireUsername, commande
    FROM historique
    WHERE username = ?
    ORDER BY id DESC
    `,
    [username]
  )
  const templateRows = await executeSQL(
    `
    SELECT username, name, planning, articles
    FROM templates
    WHERE type = 'prestataireValide'
    `
  )

  const templatesByUsername = Object.fromEntries(
    templateRows.map(template => [template.username, template])
  )

  const competitions = competitionRows.map(item => ({
    kind: "competition",
    key: `competition-${item.titre}-${item.jour}-${item.heure}`,
    title: item.titre,
    dateLabel: `${item.jour} ${item.heure}`,
    location: item.lieu || "",
    code: String(item.numero),
    payload: {
      titre: item.titre,
      jour: item.jour,
      heure: item.heure
    }
  }))

  const spectators = spectatorRows.map(item => ({
    kind: "spectator",
    key: `spectator-${item.titre}-${item.jour}-${item.heure}`,
    title: item.titre,
    dateLabel: `${item.jour} ${item.heure}`,
    location: item.lieu || "",
    code: String(item.numero),
    payload: {
      titre: item.titre,
      jour: item.jour,
      heure: item.heure
    }
  }))

  const planning = planningRows.map(item => {
    const planningEntries = parseMaybeJson(item.planning, [])
    const event = planningEntries.find(entry => entry.id === item.eventId)
    return {
      kind: "planning",
      key: `planning-${item.id}`,
      title: event?.titre || `Événement ${item.eventId}`,
      providerName: item.name || item.prestataireUsername,
      dateLabel: event ? `${event.jour} ${event.heure}` : item.eventId,
      location: event?.lieu || "",
      code: String(item.numero),
      payload: {
        prestataireUsername: item.prestataireUsername,
        eventId: item.eventId
      }
    }
  })

  const hotels = hotelRows.map(item => ({
    kind: "hotel",
    key: `hotel-${item.id}`,
    title: item.name || item.prestataireUsername,
    providerName: item.name || item.prestataireUsername,
    dateLabel: item.startDate === item.endDate ? item.startDate : `${item.startDate} au ${item.endDate}`,
    location: item.roomType === "simple" ? "Chambre simple" : "Chambre double",
    code: item.reservationCode,
    price: item.totalPrice,
    payload: {
      reservationId: item.id
    }
  }))

  const orders = orderRows.map(item => {
    const commande = parseMaybeJson(item.commande, {})
    const template = templatesByUsername[item.prestataireUsername]
    const title = template?.name || item.prestataireUsername
    return {
      kind: "order",
      key: `order-${item.id}`,
      title,
      providerName: title,
      dateLabel: commande.date || "",
      location: `${(commande.articles || []).length} article(s)`,
      code: commande.id || `CMD-${item.id}`,
      price: (commande.articles || []).reduce((sum, article) => sum + ((article.prix || 0) * (article.quantite || 1)), 0),
      articles: commande.articles || [],
      payload: {
        orderId: item.id,
        prestataireUsername: item.prestataireUsername,
        orderCode: commande.id || null
      }
    }
  })

  return {
    error: 0,
    status: 200,
    data: {
      competitions,
      spectators,
      planning,
      hotels,
      orders
    }
  }
}

export async function cancelReservationSQL(data) {
  const { kind, username, payload } = data

  if (!kind || !username || !payload) {
    return { error: 1, status: 400, data: "Paramètres manquants" }
  }

  if (kind === "competition") {
    const { titre, jour, heure } = payload
    await executeSQL(
      "DELETE FROM inscriptions WHERE username = ? AND titre = ? AND jour = ? AND heure = ?",
      [username, titre, jour, heure]
    )
    return { error: 0, status: 200, data: "Réservation compétition annulée" }
  }

  if (kind === "spectator") {
    const { titre, jour, heure } = payload
    await executeSQL(
      "DELETE FROM spectateurs WHERE username = ? AND titre = ? AND jour = ? AND heure = ?",
      [username, titre, jour, heure]
    )
    return { error: 0, status: 200, data: "Réservation spectateur annulée" }
  }

  if (kind === "planning") {
    const { prestataireUsername, eventId } = payload
    await executeSQL(
      "DELETE FROM planningPrestataire WHERE username = ? AND prestataireUsername = ? AND eventId = ?",
      [username, prestataireUsername, eventId]
    )
    return { error: 0, status: 200, data: "Réservation prestataire annulée" }
  }

  if (kind === "hotel") {
    const { reservationId } = payload
    await db.beginTransaction()

    try {
      const rows = await executeSQL(
        `
        SELECT prestataireUsername, roomType,
               DATE_FORMAT(startDate, '%Y-%m-%d') AS startDate,
               DATE_FORMAT(endDate, '%Y-%m-%d') AS endDate
        FROM hotelReservations
        WHERE id = ? AND username = ?
        FOR UPDATE
        `,
        [reservationId, username]
      )

      if (!rows.length) {
        await db.rollback()
        return { error: 1, status: 404, data: "Réservation introuvable" }
      }

      const reservation = rows[0]
      const stockColumn = reservation.roomType === "simple" ? "simpleAvailable" : "doubleAvailable"
      const dates = enumerateDates(reservation.startDate, reservation.endDate)

      for (const date of dates) {
        await executeSQL(
          `
          UPDATE hotelAvailability
          SET ${stockColumn} = ${stockColumn} + 1
          WHERE prestataireUsername = ? AND date = ?
          `,
          [reservation.prestataireUsername, date]
        )
      }

      await executeSQL(
        "DELETE FROM hotelReservations WHERE id = ? AND username = ?",
        [reservationId, username]
      )

      await db.commit()
      return { error: 0, status: 200, data: "Réservation hôtel annulée" }
    } catch (error) {
      await db.rollback()
      throw error
    }
  }

  if (kind === "order") {
    const { orderId, prestataireUsername } = payload
    const rows = await executeSQL(
      "SELECT commande FROM historique WHERE id = ? AND username = ? AND prestataireUsername = ?",
      [orderId, username, prestataireUsername]
    )

    if (!rows.length) {
      return { error: 1, status: 404, data: "Commande introuvable" }
    }

    const commande = parseMaybeJson(rows[0].commande, {})
    const templateRows = await executeSQL(
      "SELECT articles FROM templates WHERE username = ? AND type = 'prestataireValide' LIMIT 1",
      [prestataireUsername]
    )

    if (templateRows.length) {
      const articles = parseMaybeJson(templateRows[0].articles, [])
      for (const orderedArticle of commande.articles || []) {
        const article = articles.find(item => item.id === orderedArticle.id)
        if (article) {
          article.stock = Number(article.stock || 0) + Number(orderedArticle.quantite || 1)
        }
      }

      await executeSQL(
        "UPDATE templates SET articles = ? WHERE username = ? AND type = 'prestataireValide'",
        [JSON.stringify(articles), prestataireUsername]
      )
    }

    await executeSQL(
      "DELETE FROM historique WHERE id = ? AND username = ? AND prestataireUsername = ?",
      [orderId, username, prestataireUsername]
    )

    return { error: 0, status: 200, data: "Commande annulée" }
  }

  return { error: 1, status: 400, data: "Type de réservation invalide" }
}
