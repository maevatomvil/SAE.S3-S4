import { Router } from "express"
import express from "express"

import {
  getCompetitions,
  ajouterCompetition,
  supprimerCompetition,
  getPlacesRestantes
} from "../controllers/competitions.controller.js"

const router = Router()

router.get("/", getCompetitions)
router.post("/", ajouterCompetition)
router.delete("/", express.json(), supprimerCompetition)

router.get("/:titre/places-restantes", getPlacesRestantes)

export default router
