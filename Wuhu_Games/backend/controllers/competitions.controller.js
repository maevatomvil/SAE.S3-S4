import {
  getCompetitionsSQL,
  ajouterCompetitionSQL,
  supprimerCompetitionSQL,
  getPlacesRestantesSQL
} from "../services/competitions.service.js"

export async function getCompetitions(req, res) {
  try {
    const result = await getCompetitionsSQL()
    res.status(200).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de la récupération des compétitions"
    })
  }
}

export async function ajouterCompetition(req, res) {
  try {
    const result = await ajouterCompetitionSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de l'ajout de la compétition"
    })
  }
}

export async function supprimerCompetition(req, res) {
  try {
    const result = await supprimerCompetitionSQL(req.body)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de la suppression de la compétition"
    })
  }
}

export async function getPlacesRestantes(req, res) {
  try {
    const result = await getPlacesRestantesSQL(req.params.titre)
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors du calcul des places restantes"
    })
  }
}
