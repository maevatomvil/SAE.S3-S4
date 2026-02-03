import { auth } from "../middlewares/auth.js"

router.get("/prestataires", auth, controller.getPrestataires)
