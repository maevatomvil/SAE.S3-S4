const useSQL = false

import LocalSource from "@/services/localsource.service.js"

async function getCompetitionsLocal(data) {
  return await LocalSource.getCompetitions(data)
}

async function getCompetitionsSQL(data) {
  const sql = "SELECT jour, heure, titre, lieu FROM competitions"
  const rows = await executeSQL(sql)
  return { error: 0, status: 200, data: rows }
}

export async function getCompetitions(data) {
  if (!useSQL) {
    try {
      return await getCompetitionsLocal(data)
    } catch (err) {
      return { error: 1, status: 404, data: "erreur réseau, impossible de récupérer les compétitions" }
    }
  }
  return await getCompetitionsSQL(data)
}

export default {
  getCompetitions
}
