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

      pageTitleAchat: data.pageTitleAchat || '',
      pageDescriptionAchat: data.pageDescriptionAchat || '',
      articles: (data.articles || []).map(a => ({ ...a, stock: a.stock ?? 0 })),
      
      type: 'prestataire',
      username: data.username,
      email: data.email,
      services: data.services,
      locationNeeds: data.locationNeeds || ''
    }

    templates.push(newTemplate)
    saveTemplates(templates)

    return { error: 0, status: 200, data: newTemplate }
  }
}

export async function getTemplates() {
  let templates = loadTemplates()

  if (!templates.find(t => t.username === "demo01")) {
    templates.push({
      id: "prestataire-demo",
      username: "demo01",
      type: "prestataireValide",
      name: "Prestataire Démo",
      shortDescription: "Exemple de prestataire déjà présent",
      image: "",
      pageTitle: "",
      templateContent: "",
      planning: [],
      pageTitleAchat: "Boutique Démo",
      pageDescriptionAchat: "<p>Bienvenue dans la boutique démo</p>",
      articles: [
        {
          id: "article-demo",
          titre: "Article Démo",
          description: "Un article d'exemple",
          prix: 5,
          stock: 10,
          image: null
        }
      ],
      services: ["achat"],
      email: "demo@site.com",
      locationNeeds: ""
    })

    saveTemplates(templates)
  }

  return { error: 0, status: 200, data: templates }
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


export async function updateTemplate(username, data) {
  const templates = loadTemplates()
  const index = templates.findIndex(t => t.username === username)

  if (index === -1) {
    return { error: 1, status: 404, data: 'Template introuvable' }
  }

  templates[index] = {
    ...templates[index],
    ...data
  }

  saveTemplates(templates)

  return { error: 0, status: 200, data: templates[index] }
}


export default {
  saveTemplate,
  getTemplates,
  deleteTemplate,
  saveCurrentTemplate,
  getCurrentTemplate,
  clearCurrentTemplate,
  getPrestataireDemandes,
  updateTemplate
}
