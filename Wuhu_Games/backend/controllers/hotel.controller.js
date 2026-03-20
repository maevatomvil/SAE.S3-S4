import {
  getHotelAvailabilitySQL,
  saveHotelAvailabilitySQL,
  createHotelReservationSQL
} from "../services/hotel.service.js"

export async function getHotelAvailability(req, res) {
  try {
    const result = await getHotelAvailabilitySQL(req.params.prestataireUsername)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function saveHotelAvailability(req, res) {
  try {
    const result = await saveHotelAvailabilitySQL(req.params.prestataireUsername, req.body.availability || [])
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function createHotelReservation(req, res) {
  try {
    const result = await createHotelReservationSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}
