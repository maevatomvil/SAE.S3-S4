import { v4 as uuidv4 } from 'uuid'

const useSQL = false

function loadTemplates() {
  return JSON.parse(localStorage.getItem('templates') || '[]')
}

function saveTemplates(t) {
  localStorage.setItem('templates', JSON.stringify(t))
}

export async function saveTemplate(data) {
  if (!data.name || !data.shortDescription || !data.image) {
    return { error: 1, status: 400, data: 'Tous les champs sont obligatoires' }
  }

  if (!useSQL) {
    const templates = loadTemplates()

    const newTemplate = {
      id: uuidv4(),
      name: data.name,
      shortDescription: data.shortDescription,
      image: data.image,
      pageTitle: data.pageTitle || '',
      templateContent: data.templateContent || '',
      planning: data.planning || [],
      type: 'prestataire',
      username: data.username,
      email: data.email,
      services: data.services,
    }

    templates.push(newTemplate)
    saveTemplates(templates)

    return { error: 0, status: 200, data: newTemplate }
  }
}

export async function getTemplates() {
  return { error: 0, status: 200, data: loadTemplates() }
}

export async function deleteTemplate(id) {
  const templates = loadTemplates().filter(t => t.id !== id)
  saveTemplates(templates)
  return { error: 0, status: 200 }
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
  const templates = loadTemplates().filter(t => t.type === 'prestataire')
  return { error: 0, status: 200, data: templates }
}

export default {
  saveTemplate,
  getTemplates,
  deleteTemplate,
  saveCurrentTemplate,
  getCurrentTemplate,
  clearCurrentTemplate,
  getPrestataireDemandes
}
