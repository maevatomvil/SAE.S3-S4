import {
  getInscriptionsSQL,
  getNumeroSQL,
  inscrireUserSQL,
  desinscrireUserSQL
} from "../services/inscriptions.service.js"

export async function getInscriptions(req, res) {
  try {
    const result = await getInscriptionsSQL()
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de la récupération des inscriptions"
    })
  }
}

export async function getNumero(req, res) {
  try {
    const result = await getNumeroSQL(
      req.params.titre,
      req.params.jour,
      req.params.heure,
      req.params.username
    )
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de la récupération du numéro"
    })
  }
}

export async function inscrireUser(req, res) {
  try {
    const result = await inscrireUserSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de l'inscription"
    })
  }
}

export async function desinscrireUser(req, res) {
  try {
    const result = await desinscrireUserSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de la désinscription"
    })
  }
}
