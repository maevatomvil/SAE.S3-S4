import { getPrestatairesValidesSQL } from "../services/prestataireMenu.service.js"

export async function getPrestatairesValides(req, res) {
  try {
    const result = await getPrestatairesValidesSQL()
    res.status(result.status).json(result)
  } catch {
    res.status(500).json({
      error: 1,
      status: 500,
      data: "Erreur serveur lors de la récupération des prestataires"
    })
  }
}