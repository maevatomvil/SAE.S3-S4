import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


import authRoutes from "./routes/auth.routes.js"
import competitionsRoutes from "./routes/competitions.routes.js"

const app = express()
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/competitions", competitionsRoutes)

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000")
})
