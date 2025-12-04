import { v4 as uuidv4 } from 'uuid'

const useSQL = false
let templates = JSON.parse(localStorage.getItem('templates') || '[]')

function initTemplates() {
  if (!localStorage.getItem('templates')) {
    localStorage.setItem('templates', JSON.stringify(templates))
  }
}

if (!useSQL) initTemplates()

export async function saveTemplate(data) {
  if (!data.name || !data.shortDescription || !data.image || !data.pageTitle || !data.templateContent) {
    return { error: 1, status: 400, data: 'Tous les champs sont obligatoires' }
  }

  if (!useSQL) {
    const newTemplate = {
      id: uuidv4(),
      name: data.name,
      shortDescription: data.shortDescription,
      image: data.image,
      pageTitle: data.pageTitle,
      templateContent: data.templateContent,
      type: 'prestataire' 
    }
    templates.push(newTemplate)
    localStorage.setItem('templates', JSON.stringify(templates))
    return { error: 0, status: 200, data: newTemplate }
  } else {
    const sql = 'INSERT INTO templates (name, shortDescription, image, pageTitle, templateContent) VALUES (?, ?, ?, ?, ?)'
    try {
      await executeSQL(sql, [data.name, data.shortDescription, data.image, data.pageTitle, data.templateContent])
      return { error: 0, status: 200, data: data }
    } catch (err) {
      return { error: 1, status: 500, data: 'Erreur lors de l’enregistrement du formulaire' }
    }
  }
}

export async function getTemplates() {
  if (!useSQL) return { error: 0, status: 200, data: templates }
  const sql = 'SELECT * FROM templates'
  const datas = await executeSQL(sql)
  return { error: 0, status: 200, data: datas }
}

export async function deleteTemplate(id) {
  if (!useSQL) {
    templates = templates.filter(t => t.id !== id)
    localStorage.setItem('templates', JSON.stringify(templates))
    return { error: 0, status: 200 }
  } else {
    const sql = 'DELETE FROM templates WHERE id = ?'
    await executeSQL(sql, [id])
    return { error: 0, status: 200 }
  }
}

export function saveCurrentTemplate(data) {
  localStorage.setItem('currentTemplate', JSON.stringify(data))
}

export async function getCurrentTemplate() {
  return JSON.parse(localStorage.getItem('currentTemplate') || '{}')
}

export function clearCurrentTemplate() {
  localStorage.removeItem('currentTemplate')
}
export async function getPrestataireDemandes() {
  if (!useSQL) {
    const demandes = templates.filter(t => t.type === 'prestataire')
    return { error: 0, status: 200, data: demandes }
  } else {
    const sql = "SELECT * FROM templates WHERE type = 'prestataire'"
    const datas = await executeSQL(sql)
    return { error: 0, status: 200, data: datas }
  }
}


export default { saveTemplate, getTemplates, deleteTemplate, saveCurrentTemplate, getCurrentTemplate, clearCurrentTemplate }
