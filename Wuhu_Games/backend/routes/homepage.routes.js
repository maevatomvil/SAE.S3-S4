import { Router } from "express"
import { getHomePage, saveHomePage } from "../controllers/homepage.controller.js"
import { requireOrganizer } from "../middlewares/requireOrganizer.js"
const router = Router()

router.get("/", getHomePage)
router.put("/", saveHomePage)

export default router
