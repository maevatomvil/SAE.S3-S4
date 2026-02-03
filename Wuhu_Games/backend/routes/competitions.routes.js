import { Router } from "express"
import { getCompetitions } from "../controllers/competitions.controller.js"

const router = Router()

router.get("/", getCompetitions)

export default router
