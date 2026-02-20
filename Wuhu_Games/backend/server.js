import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js"
import competitionsRoutes from "./routes/competitions.routes.js"
import inscriptionsRoutes from "./routes/inscriptions.routes.js"
import spectateursRoutes from "./routes/spectateurs.routes.js"
import templateRoutes from "./routes/template.routes.js"
import prestataireRoutes from "./routes/prestataire.routes.js"

import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"


const app = express()
const swaggerDocument = YAML.load("./swagger.yaml")

app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))


app.use("/auth", authRoutes)
app.use("/competitions", competitionsRoutes)
app.use("/inscriptions", inscriptionsRoutes)
app.use("/spectateurs", spectateursRoutes)
app.use("/templates", templateRoutes)

app.use("/api/prestataire", prestataireRoutes)


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000")
})
