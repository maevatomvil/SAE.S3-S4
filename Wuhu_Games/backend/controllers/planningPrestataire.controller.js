import { inscrireSQL, desinscrireSQL, getNumeroSQL, getInscriptionsSQL } from "../services/planningPrestataire.service.js"

export async function inscrire(req, res) {
  try {
    const result = await inscrireSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function desinscrire(req, res) {
  try {
    const result = await desinscrireSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function getNumero(req, res) {
  try {
    const { prestataireUsername, eventId, username } = req.params
    const result = await getNumeroSQL(prestataireUsername, eventId, username)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function getInscriptions(req, res) {
  try {
    const { prestataireUsername, eventId } = req.params
    const result = await getInscriptionsSQL(prestataireUsername, eventId)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}