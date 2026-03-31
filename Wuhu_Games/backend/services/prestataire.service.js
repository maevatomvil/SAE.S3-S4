import { executeSQL } from "../database/db.js"

export async function accepterDemandeSQL(data) {
  await executeSQL(
    `
    INSERT INTO templates 
    (username, providerType, name, name_en, shortDescription, shortDescription_en, image, pageTitle, templateContent, planning, pageTitleAchat, pageDescriptionAchat, articles, services, email, locationNeeds, zoneId, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'prestataireValide')
    `,
    [
      data.username ?? null,
      data.providerType ?? "standard",
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
      data.locationNeeds ?? null,
      data.zoneId ?? null
    ]
  )

  if (data.providerType === "hotel" && Array.isArray(data.hotelAvailability)) {
    for (const item of data.hotelAvailability) {
      await executeSQL(
        `
        INSERT INTO hotelAvailability
        (prestataireUsername, date, simpleAvailable, doubleAvailable, priceSimple, priceDouble)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          data.username,
          item.date,
          item.simpleAvailable ?? 0,
          item.doubleAvailable ?? 0,
          item.priceSimple ?? 0,
          item.priceDouble ?? 0
        ]
      )
    }
  }

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
    "DELETE FROM hotelReservations WHERE prestataireUsername = ?",
    [username]
  )

  await executeSQL(
    "DELETE FROM hotelAvailability WHERE prestataireUsername = ?",
    [username]
  )

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
    `UPDATE templates SET 
      name = ?,
      name_en = ?,
      email = ?,
      image = ?,
      shortDescription = ?,
      shortDescription_en = ?,
      providerType = COALESCE(?, providerType),
      services = ?,
      x = COALESCE(?, x),
      y = COALESCE(?, y)
    WHERE username = ?`,
    [
      data.name ?? null,
      data.name_en ?? null,
      data.email ?? null,
      data.image ?? null,
      data.shortDescription ?? null,
      data.shortDescription_en ?? null,
      data.providerType ?? null,
      JSON.stringify(data.services || []),
      data.x ?? null,
      data.y ?? null,
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
