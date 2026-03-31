import { executeSQL } from "../database/db.js"
import sanitizeHtml from 'sanitize-html'

const sanitize = (str) => str ? sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }) : null

export async function savePrestataireDemandeSQL(data) {
  console.log("zoneId reçu backend:", data.zoneId)
  const sql = `
    INSERT INTO prestataireDemandes 
    (username, providerType, serviceName, serviceName_en, email, image, descriptionFr, descriptionEn, pageAchat, planning, hotelAvailability, pageInfo, locationNeeds, zoneId) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  const params = [
    sanitize(data.username) ?? null,
    data.providerType ?? "standard",
    sanitize(data.name) ?? null,
    sanitize(data.name_en) ?? null,
    sanitize(data.email) ?? null,
    data.image ?? null,
    sanitize(data.shortDescription) ?? null,
    sanitize(data.shortDescription_en) ?? null,
    sanitize(data.pageTitleAchat) ?? null,
    JSON.stringify(data.planning || []),
    JSON.stringify(data.hotelAvailability || []),
    data.templateContent ?? null,
    sanitize(data.locationNeeds) ?? null,
    sanitize(data.zoneId) ?? null
  ]

  const result = await executeSQL(sql, params)
  const demandeId = result.insertId

  if (data.services && Array.isArray(data.services)) {
    for (const s of data.services) {
      await executeSQL(
        "INSERT INTO prestataireDemandesServices (demandeId, serviceType) VALUES (?, ?)",
        [demandeId, s]
      )
    }
  }

  return demandeId
}

export async function getTemplatesSQL() {
  const sql = "SELECT * FROM templates"
  const templates = await executeSQL(sql)
  const hotels = await executeSQL(
    "SELECT prestataireUsername, date, simpleAvailable, doubleAvailable, priceSimple, priceDouble FROM hotelAvailability ORDER BY date ASC"
  )

  return templates.map(t => ({
    ...t,
    services: JSON.parse(t.services || '[]'),
    articles: JSON.parse(t.articles || '[]'),
    planning: JSON.parse(t.planning || '[]'),
    hotelAvailability: hotels
      .filter(h => h.prestataireUsername === t.username)
      .map(h => ({
        date: h.date,
        simpleAvailable: h.simpleAvailable,
        doubleAvailable: h.doubleAvailable,
        priceSimple: h.priceSimple,
        priceDouble: h.priceDouble
      }))
  }))
}

export async function getPrestataireDemandesSQL() {
  const demandes = await executeSQL("SELECT * FROM prestataireDemandes WHERE status = 'pending'")

  for (const d of demandes) {
    const services = await executeSQL(
      "SELECT serviceType FROM prestataireDemandesServices WHERE demandeId = ?",
      [d.id]
    )
    d.services = services.map(s => s.serviceType)

    d.name = d.serviceName
    d.name_en = d.serviceName_en
    d.shortDescription = d.descriptionFr
    d.shortDescription_en = d.descriptionEn
    d.pageTitle = d.pageAchat
    d.templateContent = d.pageInfo
    d.providerType = d.providerType || "standard"
    d.hotelAvailability = JSON.parse(d.hotelAvailability || '[]'),
    d.zoneId = d.zoneId ?? null
  }

  return demandes
}

export async function deleteTemplateSQL(id) {
  await executeSQL("DELETE FROM templates WHERE id = ?", [id])
}

export async function updateTemplateSQL(username, data) {
  const fields = []
  const params = []

  if (data.name !== undefined) { fields.push('name = ?'); params.push(sanitize(data.name)) }
  if (data.name_en !== undefined) { fields.push('name_en = ?'); params.push(sanitize(data.name_en)) }
  if (data.shortDescription !== undefined) { fields.push('shortDescription = ?'); params.push(sanitize(data.shortDescription)) }
  if (data.shortDescription_en !== undefined) { fields.push('shortDescription_en = ?'); params.push(sanitize(data.shortDescription_en)) }
  if (data.image !== undefined) { fields.push('image = ?'); params.push(data.image) }
  if (data.pageTitle !== undefined) { fields.push('pageTitle = ?'); params.push(sanitize(data.pageTitle)) }
  if (data.templateContent !== undefined) { fields.push('templateContent = ?'); params.push(data.templateContent) }
  if (data.planning !== undefined) { fields.push('planning = ?'); params.push(JSON.stringify(data.planning)) }
  if (data.pageTitleAchat !== undefined) { fields.push('pageTitleAchat = ?'); params.push(sanitize(data.pageTitleAchat)) }
  if (data.pageDescriptionAchat !== undefined) { fields.push('pageDescriptionAchat = ?'); params.push(data.pageDescriptionAchat) }
  if (data.articles !== undefined) { fields.push('articles = ?'); params.push(JSON.stringify(data.articles)) }
  if (data.services !== undefined) { fields.push('services = ?'); params.push(JSON.stringify(data.services)) }
  if (data.email !== undefined) { fields.push('email = ?'); params.push(sanitize(data.email)) }
  if (data.locationNeeds !== undefined) { fields.push('locationNeeds = ?'); params.push(sanitize(data.locationNeeds)) }
  if (data.zoneId !== undefined) { fields.push('zoneId = ?'); params.push(data.zoneId) }


  if (fields.length === 0) return

  params.push(username)
  const sql = `UPDATE templates SET ${fields.join(', ')} WHERE username = ?`
  await executeSQL(sql, params)
}