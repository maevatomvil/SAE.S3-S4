import { Router } from "express"
import express from "express"

import {
  getInscriptions,
  getNumero,
  inscrireUser,
  desinscrireUser
} from "../controllers/inscriptions.controller.js"

const router = Router()

router.get("/", getInscriptions)
router.get("/:titre/:jour/:heure/numero/:username", getNumero)
router.post("/", express.json(), inscrireUser)
router.delete("/", express.json(), desinscrireUser)

export default router
