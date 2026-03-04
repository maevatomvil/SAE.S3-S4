const useSQL = true //doit etre pareil que le usql de localsource.service.js et competitions.js

import LocalSource from "@/services/localsource.service.js"
import api from "@/services/axios.service.js"

async function getCompetitionsLocal(data) {
  return await LocalSource.getCompetitions(data)
}

async function getCompetitionsSQL() {
  const res = await api.get("/competitions")
  return res.data
}

export async function getCompetitions(data) {
  if (!useSQL) {
    try {
      return await getCompetitionsLocal(data)
    } catch {
      return { error: 1, status: 404, data: "erreur réseau, impossible de récupérer les compétitions" }
    }
  }

  return await getCompetitionsSQL()
}

export default {
  getCompetitions
}
