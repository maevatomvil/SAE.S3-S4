import { executeSQL } from "../database/db.js"
export async function getCompetitionsSQL() {
  const sql = `
    SELECT c.jour, c.heure, c.titre, c.lieu,
           i.username, u.firstname, u.surname, i.numero
    FROM competitions c
    LEFT JOIN inscriptions i 
      ON i.titre = c.titre
    AND i.jour = c.jour
    AND i.heure = c.heure
    LEFT JOIN users u ON u.username = i.username
  `
  const rows = await executeSQL(sql)

  const map = {}

  for (const r of rows) {
    const key = `${r.titre}-${r.jour}-${r.heure}`
    if (!map[key]) {
      map[key] = {
        titre: r.titre,
        jour: r.jour,
        heure: r.heure,
        lieu: r.lieu,
        joueurs: []
      }
    }

    if (r.username) {
      map[key].joueurs.push({
        username: r.username,
        firstname: r.firstname,
        surname: r.surname,
        numero: r.numero
      })
    }
  }

  return { error: 0, status: 200, data: Object.values(map) }
}


export async function ajouterCompetitionSQL(data) {
  const { titre, jour, heure, lieu } = data
  const sql = "INSERT INTO competitions (titre, jour, heure, lieu) VALUES (?, ?, ?, ?)"
  await executeSQL(sql, [titre, jour, heure, lieu])
  return { error: 0, status: 201, data: "Compétition ajoutée" }
}

export async function supprimerCompetitionSQL(data) {
  const { titre, jour, heure } = data
  const sql = "DELETE FROM competitions WHERE titre = ? AND jour = ? AND heure = ?"
  await executeSQL(sql, [titre, jour, heure])
  return { error: 0, status: 200, data: "Compétition supprimée" }
}

export async function getPlacesRestantesSQL(titre) {
  const sqlMax = "SELECT lieu FROM competitions WHERE titre = ? LIMIT 1"
  const rows = await executeSQL(sqlMax, [titre])
  if (rows.length === 0) return { error: 1, status: 404, data: "Compétition introuvable" }

  const lieu = rows[0].lieu

  const placesParLieu = {
    "Stadium Wuhu": 500,
    "Golf Wuhu": 300,
    "Terrain de tir à l'arc": 200,
    "Piste de cyclisme": 300,
    "Rivière Wuhu": 1
  }

  const max = placesParLieu[lieu] ?? 50

  const sqlCount = "SELECT COUNT(*) AS total FROM inscriptions WHERE titre = ?"
  const countRows = await executeSQL(sqlCount, [titre])
  const reservees = countRows[0].total

  return { error: 0, status: 200, data: max - reservees }
}
