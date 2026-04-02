import { Router } from "express"
import { cancelReservation, getUserReservations } from "../controllers/reservations.controller.js"

const router = Router()

router.get("/:username", getUserReservations)
router.delete("/", cancelReservation)

export default router
