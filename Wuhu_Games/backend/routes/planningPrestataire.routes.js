import { Router } from "express"
import { inscrire, desinscrire, getNumero, getInscriptions } from "../controllers/planningPrestataire.controller.js"

const router = Router()

router.post("/", inscrire)
router.delete("/", desinscrire)
router.get("/:prestataireUsername/:eventId/numero/:username", getNumero)
router.get("/:prestataireUsername/:eventId", getInscriptions)

export default router