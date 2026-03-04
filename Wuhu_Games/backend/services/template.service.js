import { executeSQL } from "../database/db.js"

export async function savePrestataireDemandeSQL(data) {
  const sql = `
    INSERT INTO prestataireDemandes 
    (username, serviceName, serviceName_en, email, image, descriptionFr, descriptionEn, pageAchat, planning, pageInfo, locationNeeds) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  const params = [
    data.username ?? null,
    data.name ?? null,
    data.name_en ?? null,
    data.email ?? null,
    data.image ?? null,
    data.shortDescription ?? null,
    data.shortDescription_en ?? null,
    data.pageTitleAchat ?? null,
    JSON.stringify(data.planning || []),
    data.templateContent ?? null,
    data.locationNeeds ?? null
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
  return templates.map(t => ({
    ...t,
    services: JSON.parse(t.services || '[]'),
    articles: JSON.parse(t.articles || '[]'),
    planning: JSON.parse(t.planning || '[]')
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
  }

  return demandes
}


export async function deleteTemplateSQL(id) {
  await executeSQL("DELETE FROM templates WHERE id = ?", [id])
}

export async function updateTemplateSQL(username, data) {
  const fields = []
  const params = []

  if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name) }
  if (data.name_en !== undefined) { fields.push('name_en = ?'); params.push(data.name_en) }
  if (data.shortDescription !== undefined) { fields.push('shortDescription = ?'); params.push(data.shortDescription) }
  if (data.shortDescription_en !== undefined) { fields.push('shortDescription_en = ?'); params.push(data.shortDescription_en) }
  if (data.image !== undefined) { fields.push('image = ?'); params.push(data.image) }
  if (data.pageTitle !== undefined) { fields.push('pageTitle = ?'); params.push(data.pageTitle) }
  if (data.templateContent !== undefined) { fields.push('templateContent = ?'); params.push(data.templateContent) }
  if (data.planning !== undefined) { fields.push('planning = ?'); params.push(JSON.stringify(data.planning)) }
  if (data.pageTitleAchat !== undefined) { fields.push('pageTitleAchat = ?'); params.push(data.pageTitleAchat) }
  if (data.pageDescriptionAchat !== undefined) { fields.push('pageDescriptionAchat = ?'); params.push(data.pageDescriptionAchat) }
  if (data.articles !== undefined) { fields.push('articles = ?'); params.push(JSON.stringify(data.articles)) }
  if (data.services !== undefined) { fields.push('services = ?'); params.push(JSON.stringify(data.services)) }
  if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email) }
  if (data.locationNeeds !== undefined) { fields.push('locationNeeds = ?'); params.push(data.locationNeeds) }
  if (data.x !== undefined) { fields.push('x = ?'); params.push(data.x) }
  if (data.y !== undefined) { fields.push('y = ?'); params.push(data.y) }

  if (fields.length === 0) return

  params.push(username)
  const sql = `UPDATE templates SET ${fields.join(', ')} WHERE username = ?`
  await executeSQL(sql, params)
}