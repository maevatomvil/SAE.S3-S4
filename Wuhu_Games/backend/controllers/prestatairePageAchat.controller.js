import {
  getPanierSQL,
  savePanierSQL,
  removePanierSQL,
  getHistoriqueSQL,
  saveHistoriqueSQL,
  finaliserCommandeSQL
} from "../services/prestatairePageAchat.service.js"

export async function getPanier(req, res) {
  try {
    const result = await getPanierSQL(req.params.username, req.params.prestataireUsername)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur lors de la récupération du panier" })
  }
}

export async function savePanier(req, res) {
  try {
    const result = await savePanierSQL(req.params.username, req.params.prestataireUsername, req.body.panier)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur lors de la sauvegarde du panier" })
  }
}

export async function removePanier(req, res) {
  try {
    const result = await removePanierSQL(req.params.username, req.params.prestataireUsername)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur lors de la suppression du panier" })
  }
}

export async function getHistorique(req, res) {
  try {
    const result = await getHistoriqueSQL(req.params.username, req.params.prestataireUsername)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur lors de la récupération de l'historique" })
  }
}

export async function saveHistorique(req, res) {
  try {
    const result = await saveHistoriqueSQL(req.params.username, req.params.prestataireUsername, req.body.historique)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur lors de la sauvegarde de l'historique" })
  }
}

export async function finaliserCommande(req, res) {
  try {
    const result = await finaliserCommandeSQL(req.body.commande)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({ error: 1, status: 500, data: "Erreur serveur lors de la finalisation de la commande" })
  }
}