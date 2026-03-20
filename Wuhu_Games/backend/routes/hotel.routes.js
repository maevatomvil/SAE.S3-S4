import { Router } from "express"
import {
  getHotelAvailability,
  saveHotelAvailability,
  createHotelReservation
} from "../controllers/hotel.controller.js"

const router = Router()

router.get("/:prestataireUsername/availability", getHotelAvailability)
router.put("/:prestataireUsername/availability", saveHotelAvailability)
router.post("/reservation", createHotelReservation)

export default router
