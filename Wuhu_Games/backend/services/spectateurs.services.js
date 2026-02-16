import { executeSQL } from "../database/db.js"

export async function getSpectateurs() {
  const sql = "SELECT titre, jour, heure, username, numero FROM spectateurs"
  const rows = await executeSQL(sql)
  return { error: 0, status: 200, data: rows }
}


export async function getSpectateursForCompet(titre, jour, heure) {
  const sql = "SELECT username, numero FROM spectateurs WHERE titre = ? AND jour = ? AND heure = ?"
  const rows = await executeSQL(sql, [titre, jour, heure])
  return { error: 0, status: 200, data: rows }
}



export async function getNumeroSpectateur(titre, jour, heure, username) {
  const sql = "SELECT numero FROM spectateurs WHERE titre = ? AND jour = ? AND heure = ? AND username = ?"
  const rows = await executeSQL(sql, [titre, jour, heure, username])
  const numero = rows.length ? rows[0].numero : null
  return { error: 0, status: 200, data: numero }
}

export async function inscrireSpectateur(data) {
  let numero
  do {
    numero = Math.floor(Math.random() * 99999) + 1
    const check = await executeSQL(
      "SELECT numero FROM spectateurs WHERE titre = ? AND numero = ?",
      [data.titre, numero]
    )
    if (!check.length) break
  } while (true)

  const sql = "INSERT INTO spectateurs (titre, jour, heure, username, numero) VALUES (?, ?, ?, ?, ?)"
  await executeSQL(sql, [
    data.titre,
    data.jour,
    data.heure,
    data.username,
    numero
  ])

  return { error: 0, status: 200, data: numero }
}

export async function desinscrireSpectateur(data) {
  const sql = "DELETE FROM spectateurs WHERE titre = ? AND jour = ? AND heure = ? AND username = ?"
  await executeSQL(sql, [
    data.titre,
    data.jour,
    data.heure,
    data.username
  ])

  return { error: 0, status: 200, data: true }
}

export default {
  getSpectateurs,
  getSpectateursForCompet,
  getNumeroSpectateur,
  inscrireSpectateur,
  desinscrireSpectateur
}
