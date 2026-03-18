import {
  getMessagesSQL,
  addMessageSQL,
  deleteMessageSQL,
  getStatsSQL
} from "../services/livreDor.service.js"

export async function getMessages(req, res) {
  try {
    const result = await getMessagesSQL(req.params.prestataireUsername)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function addMessage(req, res) {
  try {
    const result = await addMessageSQL(req.params.prestataireUsername, req.body.message)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}

export async function deleteMessage(req, res) {
  try {
    const result = await deleteMessageSQL(req.params.id)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}



export async function getStats(req, res) {
  try {
    const result = await getStatsSQL(req.params.prestataireUsername)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur" })
  }
}



