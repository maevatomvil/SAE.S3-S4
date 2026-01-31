import { getCompetitionsSQL } from "../services/competitions.services.js"

export async function getCompetitions(req, res) {
  try {
    const result = await getCompetitionsSQL()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de la récupération des compétitions"
    })
  }
}
