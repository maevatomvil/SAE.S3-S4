import express from "express"
import PrestataireService from "../services/prestataire.service.js"

const router = express.Router()

router.post("/accepter", async (req, res) => {
  const demande = req.body
  const result = await PrestataireService.accepterDemande(demande)
  res.status(result.status).json(result)
})

router.post("/refuser", async (req, res) => {
  const demande = req.body
  const result = await PrestataireService.refuserDemande(demande)
  res.status(result.status).json(result)
})

router.delete("/:username", async (req, res) => {
  const username = req.params.username
  const result = await PrestataireService.supprimerPrestataire(username)
  res.status(result.status).json(result)
})

router.put("/update", async (req, res) => {
  const updatedPrestataire = req.body
  const result = await PrestataireService.updatePrestataire(updatedPrestataire)
  res.status(result.status).json(result)
})

export default router
