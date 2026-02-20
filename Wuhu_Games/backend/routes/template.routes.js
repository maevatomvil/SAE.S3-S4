import express from "express"
import {
  envoyerDemandePrestataire,
  getTemplates,
  getPrestataireDemandes,
  deleteTemplate,
  updateTemplate
} from "../controllers/template.controller.js"

const router = express.Router()

router.post("/demande", envoyerDemandePrestataire)
router.get("/", getTemplates)
router.get("/demandes", getPrestataireDemandes)
router.delete("/:id", deleteTemplate)
router.put("/:username", updateTemplate)

export default router
