import express from "express"
import { requireOrganizer } from "../middlewares/requireOrganizer.js"
import {
  getSpectateurs,
  getSpectateursForCompet,
  getNumeroSpectateur,
  inscrireSpectateur,
  desinscrireSpectateur
} from "../controllers/spectateurs.controller.js"

const router = express.Router()

router.get("/", getSpectateurs)
router.get("/:titre/:jour/:heure", getSpectateursForCompet)
router.get("/:titre/:jour/:heure/numero/:username", getNumeroSpectateur)
router.post("/", inscrireSpectateur)
router.delete("/", desinscrireSpectateur)

export default router
