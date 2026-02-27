import { Router } from "express"
import {
  getPanier,
  savePanier,
  removePanier,
  getHistorique,
  saveHistorique,
  finaliserCommande
} from "../controllers/prestatairePageAchat.controller.js"

const router = Router()

router.get("/panier/:username/:prestataireUsername", getPanier)
router.post("/panier/:username/:prestataireUsername", savePanier)
router.delete("/panier/:username/:prestataireUsername", removePanier)

router.get("/historique/:username/:prestataireUsername", getHistorique)
router.post("/historique/:username/:prestataireUsername", saveHistorique)

router.post("/commandes", finaliserCommande)

export default router