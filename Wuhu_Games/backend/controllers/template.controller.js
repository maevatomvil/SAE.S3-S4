import {
  savePrestataireDemandeSQL,
  getTemplatesSQL,
  getPrestataireDemandesSQL,
  deleteTemplateSQL,
  updateTemplateSQL
} from "../services/template.service.js"

export async function envoyerDemandePrestataire(req, res) {
  try {
    const id = await savePrestataireDemandeSQL(req.body)
    res.json({ error: 0, status: 200, data: { id } })
  } catch (err) {
    console.error("SQL ERROR:", err)   
    res.json({ error: 1, status: 500, data: "Erreur SQL" })
  }
}


export async function getTemplates(req, res) {
  try {
    const templates = await getTemplatesSQL()
    res.json({ error: 0, status: 200, data: templates })
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL" })
  }
}

export async function getPrestataireDemandes(req, res) {
  try {
    const demandes = await getPrestataireDemandesSQL()
    res.json({ error: 0, status: 200, data: demandes })
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL" })
  }
}

export async function deleteTemplate(req, res) {
  try {
    await deleteTemplateSQL(req.params.id)
    res.json({ error: 0, status: 200 })
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL" })
  }
}

export async function updateTemplate(req, res) {
  try {
    await updateTemplateSQL(req.params.username, req.body)
    res.json({ error: 0, status: 200 })
  } catch (err) {
    res.json({ error: 1, status: 500, data: "Erreur SQL" })
  }
}
