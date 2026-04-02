import { cancelReservationSQL, getUserReservationsSQL } from "../services/reservations.service.js"

export async function getUserReservations(req, res) {
  try {
    const result = await getUserReservationsSQL(req.params.username)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function cancelReservation(req, res) {
  try {
    const result = await cancelReservationSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}
