import {
  accepterDemandeSQL,
  refuserDemandeSQL,
  supprimerPrestataireSQL,
  updatePrestataireSQL
} from "../services/prestataire.service.js"

export async function accepterDemande(req, res) {
  try {
    const result = await accepterDemandeSQL(req.body)
    res.json(result)
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL acceptation" })
  }
}

export async function refuserDemande(req, res) {
  try {
    const result = await refuserDemandeSQL(req.body)
    res.json(result)
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL refus" })
  }
}

export async function supprimerPrestataire(req, res) {
  try {
    const result = await supprimerPrestataireSQL(req.params.username)
    res.json(result)
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL suppression" })
  }
}

export async function updatePrestataire(req, res) {
  try {
    const result = await updatePrestataireSQL(req.body)
    res.json(result)
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL update" })
  }
}
