import TemplateService from './template.service.js'
import api from "@/services/axios.service.js"

const useSQL = false

export async function getPrestatairesValides() {
  if (!useSQL) {
    const templates = JSON.parse(localStorage.getItem('templates') || '[]')
    const valides = templates.filter(t => t.type === 'prestataireValide')
    return { error: 0, status: 200, data: valides }
  } else {
    const res = await api.get("/prestataires-valides")
    return res.data
  }
}

export default { getPrestatairesValides }
