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
      name_en: data.name_en || data.name, 
      shortDescription: data.shortDescription,
      shortDescription_en: data.shortDescription_en || data.shortDescription,
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
      locationNeeds: data.locationNeeds || '',
      x: data.x,
      y: data.y 
    }
    const existed = templates.some(t => t.username === data.username)
    templates.push(newTemplate)
    if (!existed) {
      localStorage.removeItem('views_' + data.username)

      const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]')
      const filtered = allOrders.filter(o => o.prestataireUsername !== data.username)
      localStorage.setItem('allOrders', JSON.stringify(filtered))
    }

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

      name: "Boutique Sport Wuhu",
      name_en: "Wuhu Sports Shop",

      shortDescription: "Boutique officielle proposant gourdes, t-shirts, serviettes et accessoires sportifs.",
      shortDescription_en: "Official shop offering water bottles, t-shirts, towels and sports accessories.",

      image: "",

      pageTitle: "",
      templateContent: "",
      planning: [],

      pageTitleAchat: "Boutique Sport Wuhu",
      pageDescriptionAchat: "<p>Découvrez notre sélection de produits officiels : gourdes, t-shirts, serviettes et accessoires pour les Wuhu Games.</p>",

      articles: [
        {
          id: "article-demo-1",
          titre: "Gourde officielle Wuhu",
          description: "Gourde légère et résistante, idéale pour les activités sportives.",
          prix: 12,
          stock: 25,
          image: null
        },
        {
          id: "article-demo-2",
          titre: "T-shirt Wuhu Games",
          description: "T-shirt respirant avec le logo officiel des Wuhu Games.",
          prix: 20,
          stock: 15,
          image: null
        },
        {
          id: "article-demo-3",
          titre: "Serviette microfibre Wuhu",
          description: "Serviette absorbante et compacte, parfaite pour le sport.",
          prix: 10,
          stock: 30,
          image: null
        }
      ],

      services: ["achat"],
      email: "demo@site.com",
      locationNeeds: "",
      x: 30,
      y: 60,

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
  const all = JSON.parse(localStorage.getItem('currentTemplate') || '{}')
  const updated = { ...all, ...data }
  localStorage.setItem('currentTemplate', JSON.stringify(updated))
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
