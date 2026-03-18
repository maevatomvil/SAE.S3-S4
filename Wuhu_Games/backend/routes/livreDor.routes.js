import { Router } from "express"
import { getMessages, addMessage, deleteMessage ,getStats} from "../controllers/livreDor.controller.js"

const router = Router()
router.get("/:prestataireUsername/stats", getStats)
router.get("/:prestataireUsername", getMessages)
router.post("/:prestataireUsername", addMessage)
router.delete("/:id", deleteMessage)
export default router