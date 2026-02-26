import { Router } from "express"
import { getPrestatairesValides } from "../controllers/prestataireMenu.controller.js"

const router = Router()

router.get("/", getPrestatairesValides)

export default router