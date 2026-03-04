import TemplateService from './template.service.js'
import api from "@/services/axios.service.js"

const useSQL = true

async function accepterDemande(demande) {
  if (!useSQL) {
    const templates = JSON.parse(localStorage.getItem('templates') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const index = templates.findIndex(t => t.id === demande.id)
    if (index !== -1) {
      templates[index].type = 'prestataireValide'
      localStorage.setItem('templates', JSON.stringify(templates))
    }

    const user = users.find(u => u.username === demande.username)
    if (user) {
      user.role = 'prestataire'
      localStorage.setItem('users', JSON.stringify(users))
    }
    return { error: 0, status: 200, data: demande }
  } else {
    const res = await api.post("/prestataire/accepter", demande)
    return res.data
  }
}

async function refuserDemande(demande) {
  if (!useSQL) {
    const templates = JSON.parse(localStorage.getItem('templates') || '[]')
    const updatedTemplates = templates.filter(t => t.id !== demande.id)

    localStorage.setItem('templates', JSON.stringify(updatedTemplates))
    return { error: 0, status: 200 }
  } else {
    const res = await api.post("/prestataire/refuser", demande)
    return res.data
  }
}

async function supprimerPrestataire(username) {
  if (!useSQL) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const prestataires = JSON.parse(localStorage.getItem('templates') || '[]')
    const updatedPrestataires = prestataires.filter(p => p.username !== username)
    localStorage.setItem('templates', JSON.stringify(updatedPrestataires))
    const user = users.find(u => u.username === username)
    if (user) {
      user.role = 'visiteur'
      localStorage.setItem('users', JSON.stringify(users))
    }
    return { error: 0, status: 200 }
  } else {
    const res = await api.delete(`/prestataire/${username}`)
    return res.data
  }
}

async function updatePrestataire(updatedPrestataire) {
  if (!useSQL) {
    const templates = JSON.parse(localStorage.getItem('templates') || '[]')
    const index = templates.findIndex(
      t => t.username === updatedPrestataire.username && t.type === 'prestataireValide'
    )

    if (index !== -1) {
      templates[index] = {
        ...templates[index],
        ...updatedPrestataire,
        x: updatedPrestataire.x ?? templates[index].x,
        y: updatedPrestataire.y ?? templates[index].y
      }
      localStorage.setItem('templates', JSON.stringify(templates))
      return { error: 0, status: 200 }
    }
    return { error: 1, status: 404 }
  } else {
    const res = await api.put("/prestataire/update", updatedPrestataire)
    return res.data
  }
}

export default { accepterDemande, refuserDemande, supprimerPrestataire, updatePrestataire }
