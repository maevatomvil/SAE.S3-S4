import express from "express"
import * as controller from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/login", controller.login)
router.post("/signup", controller.signup)
router.get("/session", controller.checkSession)
router.post("/logout", controller.logout)

export default router
