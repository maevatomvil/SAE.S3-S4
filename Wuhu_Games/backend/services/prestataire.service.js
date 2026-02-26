import { executeSQL } from "../database/db.js"

export async function accepterDemandeSQL(data) {

  await executeSQL(
    `
    INSERT INTO templates 
    (username, name, name_en, shortDescription, shortDescription_en, image, pageTitle, templateContent, planning, pageTitleAchat, pageDescriptionAchat, articles, services, email, locationNeeds, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'prestataireValide')
    `,
    [
      
    data.username ?? null,
    data.name ?? null,
    data.name_en ?? null,
    data.shortDescription ?? null,
    data.shortDescription_en ?? null,
    data.image ?? null,
    data.pageTitle ?? null,
    data.templateContent ?? null,
    JSON.stringify(data.planning || []),
    data.pageTitleAchat ?? null,
    data.pageDescriptionAchat ?? null,
    JSON.stringify(data.articles || []),
    JSON.stringify(data.services || []),
    data.email ?? null,
    data.locationNeeds ?? null
  ]

    
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
    WHERE username = ? 
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



export async function getPrestataireDemandes() {
  return await executeSQL("SELECT * FROM prestataireDemandes")
}





export async function accepterDemande(data) {
  return await accepterDemandeSQL(data)
}

export async function refuserDemande(data) {
  return await refuserDemandeSQL(data)
}

export async function supprimerPrestataire(username) {
  return await supprimerPrestataireSQL(username)
}

export async function updatePrestataire(data) {
  return await updatePrestataireSQL(data)
}




export default {
  accepterDemande,
  refuserDemande,
  supprimerPrestataire,
  updatePrestataire,
  getPrestataireDemandes
}
