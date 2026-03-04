import { Router } from "express"
import { getHomePage, saveHomePage } from "../controllers/homepage.controller.js"

const router = Router()

router.get("/", getHomePage)
router.put("/", saveHomePage)

export default router
