import { executeSQL } from "../database/db.js"

export async function getInscriptionsSQL() {
  const sql = "SELECT titre, jour, heure, username, numero FROM inscriptions"

  const rows = await executeSQL(sql)

  const map = {}

  for (const r of rows) {
    const key = `${r.titre}-${r.jour}-${r.heure}`
    if (!map[key]) map[key] = {}
    map[key][r.username] = r.numero

  }

  return { error: 0, status: 200, data: map }
}



export async function getNumeroSQL(titre, jour, heure, username) {
  const sql = `
    SELECT numero
    FROM inscriptions
    WHERE TRIM(titre) = TRIM(?)
      AND TRIM(jour) = TRIM(?)
      AND TRIM(heure) = TRIM(?)
      AND TRIM(username) = TRIM(?)
    LIMIT 1
  `

  const rows = await executeSQL(sql, [titre, jour, heure, username])

  if (rows.length === 0) {
    return { error: 0, status: 200, data: null }
  }

  return { error: 0, status: 200, data: rows[0].numero }
}


export async function inscrireUserSQL(data) {
  const { titre, jour, heure, username } = data

  let numero
  let rows

  do {
    numero = Math.floor(Math.random() * 99999) + 1
    rows = await executeSQL(
      "SELECT numero FROM inscriptions WHERE titre = ? AND numero = ?",
      [titre, numero]
    )
  } while (rows.length > 0)

  const sql = `
    INSERT INTO inscriptions (titre, jour, heure, username, numero)
    VALUES (TRIM(?), TRIM(?), TRIM(?), TRIM(?), ?)
  `
  await executeSQL(sql, [titre, jour, heure, username, numero])

  return { error: 0, status: 201, data: numero }
}






export async function desinscrireUserSQL(data) {
  const { titre, jour, heure, username } = data

  const sql = "DELETE FROM inscriptions WHERE titre = ? AND jour = ? AND heure = ? AND username = ?"
  await executeSQL(sql, [titre, jour, heure, username])

  return { error: 0, status: 200, data: "Utilisateur désinscrit" }
}
