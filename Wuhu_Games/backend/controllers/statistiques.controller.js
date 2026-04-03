import {
  getViewsSQL,
  addViewSQL,
  getCommandesSQL,
  getHotelReservationsSQL
} from "../services/statistiques.service.js"

export async function getViews(req, res) {
  try {
    const result = await getViewsSQL(req.params.username)
    res.status(200).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function addView(req, res) {
  try {
    const result = await addViewSQL(req.params.username)
    res.status(200).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function getCommandes(req, res) {
  try {
    const result = await getCommandesSQL(req.params.username)
    res.status(200).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function getHotelReservations(req, res) {
  try {
    const result = await getHotelReservationsSQL(req.params.username)
    res.status(200).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}
