import { Router } from "express"
import {
  getViews,
  addView,
  getCommandes,
  getHotelReservations
} from "../controllers/statistiques.controller.js"

const router = Router()

router.get("/views/:username", getViews)
router.post("/views/:username", addView)
router.get("/commandes/:username", getCommandes)
router.get("/hotels/:username/reservations", getHotelReservations)

export default router
