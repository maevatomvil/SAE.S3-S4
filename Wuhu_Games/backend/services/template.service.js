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
  const sql = `
    UPDATE templates SET 
      name = ?, 
      name_en = ?, 
      shortDescription = ?, 
      shortDescription_en = ?, 
      image = ?, 
      pageTitle = ?, 
      templateContent = ?, 
      planning = ?, 
      pageTitleAchat = ?, 
      pageDescriptionAchat = ?, 
      articles = ?, 
      services = ?, 
      email = ?, 
      locationNeeds = ?, 
      x = ?, 
      y = ?
    WHERE username = ?
  `

  const params = [
    data.name,
    data.name_en,
    data.shortDescription,
    data.shortDescription_en,
    data.image,
    data.pageTitle,
    data.templateContent,
    JSON.stringify(data.planning || []),
    data.pageTitleAchat,
    data.pageDescriptionAchat,
    JSON.stringify(data.articles || []),
    JSON.stringify(data.services || []),
    data.email,
    data.locationNeeds,
    data.x,
    data.y,
    username
  ]

  await executeSQL(sql, params)
}
