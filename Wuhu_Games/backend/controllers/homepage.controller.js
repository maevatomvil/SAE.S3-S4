import { getHomePageSQL, saveHomePageSQL } from "../services/homepage.service.js"

export async function getHomePage(req, res) {
  try {
    const result = await getHomePageSQL()
    res.status(result.status).json(result)
  } catch (err) {
    console.error("getHomePage SQL ERROR:", err)
    res.status(500).json({ error: 1, status: 500, data: "Erreur SQL" })
  }
}

export async function saveHomePage(req, res) {
  try {
    const result = await saveHomePageSQL(req.body)
    res.status(result.status).json(result)
  } catch (err) {
    console.error("saveHomePage SQL ERROR:", err)
    res.status(500).json({ error: 1, status: 500, data: "Erreur SQL" })
  }
}
