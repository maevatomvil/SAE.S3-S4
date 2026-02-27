import { executeSQL } from "../database/db.js"

export async function getPanierSQL(username, prestataireUsername) {
  const rows = await executeSQL(
    "SELECT article FROM panier WHERE username = ? AND prestataireUsername = ?",
    [username, prestataireUsername]
  )
  return { error: 0, status: 200, data: rows.map(r => JSON.parse(r.article)) }
}

export async function savePanierSQL(username, prestataireUsername, panier) {
  await executeSQL(
    "DELETE FROM panier WHERE username = ? AND prestataireUsername = ?",
    [username, prestataireUsername]
  )
  for (const item of panier) {
    await executeSQL(
      "INSERT INTO panier (username, prestataireUsername, article) VALUES (?, ?, ?)",
      [username, prestataireUsername, JSON.stringify(item)]
    )
  }
  return { error: 0, status: 200, data: "Panier sauvegardé" }
}

export async function removePanierSQL(username, prestataireUsername) {
  await executeSQL(
    "DELETE FROM panier WHERE username = ? AND prestataireUsername = ?",
    [username, prestataireUsername]
  )
  return { error: 0, status: 200, data: "Panier supprimé" }
}

export async function getHistoriqueSQL(username, prestataireUsername) {
  const rows = await executeSQL(
    "SELECT commande FROM historique WHERE username = ? AND prestataireUsername = ?",
    [username, prestataireUsername]
  )
  return { error: 0, status: 200, data: rows.map(r => JSON.parse(r.commande)) }
}

export async function saveHistoriqueSQL(username, prestataireUsername, historique) {
  for (const commande of historique) {
    const exists = await executeSQL(
      "SELECT id FROM historique WHERE username = ? AND prestataireUsername = ? AND JSON_EXTRACT(commande, '$.id') = ?",
      [username, prestataireUsername, commande.id]
    )
    if (exists.length === 0) {
      await executeSQL(
        "INSERT INTO historique (username, prestataireUsername, commande) VALUES (?, ?, ?)",
        [username, prestataireUsername, JSON.stringify(commande)]
      )
    }
  }
  return { error: 0, status: 200, data: "Historique sauvegardé" }
}

export async function finaliserCommandeSQL(commande) {
  await executeSQL(
    "INSERT INTO historique (username, prestataireUsername, commande) VALUES (?, ?, ?)",
    [commande.username, commande.prestataireUsername, JSON.stringify(commande)]
  )
  await executeSQL(
    "DELETE FROM panier WHERE username = ? AND prestataireUsername = ?",
    [commande.username, commande.prestataireUsername]
  )
  return { error: 0, status: 200, data: "Commande finalisée" }
}