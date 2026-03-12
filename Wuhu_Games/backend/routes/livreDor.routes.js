import { Router } from "express"
import { getMessages, addMessage, deleteMessage } from "../controllers/livreDor.controller.js"

const router = Router()

router.get("/:prestataireUsername", getMessages)
router.post("/:prestataireUsername", addMessage)
router.delete("/:id", deleteMessage)

export default router