import { executeSQL } from "../database/db.js"

export async function accepterDemandeSQL(data) {
  await executeSQL(
    "UPDATE templates SET type = 'prestataireValide' WHERE username = ?",
    [data.username]
  )

  await executeSQL(
    "UPDATE users SET role = 'prestataire' WHERE username = ?",
    [data.username]
  )

  await executeSQL(
    "DELETE FROM prestataireDemandes WHERE id = ?",
    [data.id]
  )

  await executeSQL(
    "DELETE FROM prestataireDemandesServices WHERE demandeId = ?",
    [data.id]
  )

  return { error: 0, status: 200 }
}

export async function refuserDemandeSQL(data) {
  await executeSQL(
    "DELETE FROM prestataireDemandes WHERE id = ?",
    [data.id]
  )

  await executeSQL(
    "DELETE FROM prestataireDemandesServices WHERE demandeId = ?",
    [data.id]
  )

  return { error: 0, status: 200 }
}

export async function supprimerPrestataireSQL(username) {
  await executeSQL(
    "DELETE FROM templates WHERE username = ?",
    [username]
  )

  await executeSQL(
    "UPDATE users SET role = 'visiteur' WHERE username = ?",
    [username]
  )

  return { error: 0, status: 200 }
}

export async function updatePrestataireSQL(data) {
  await executeSQL(
    `
    UPDATE templates
    SET 
      name = ?,
      email = ?,
      image = ?,
      shortDescription = ?,
      services = ?,
      x = ?,
      y = ?
    WHERE username = ? AND type = 'prestataireValide'
    `,
    [
      data.name,
      data.email,
      data.image,
      data.shortDescription,
      JSON.stringify(data.services),
      data.x,
      data.y,
      data.username
    ]
  )

  return { error: 0, status: 200 }
}

export default {
  accepterDemandeSQL,
  refuserDemandeSQL,
  supprimerPrestataireSQL,
  updatePrestataireSQL
}
