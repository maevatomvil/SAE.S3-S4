import TemplateService from './template.service.js'

const useSQL = false
let templates = JSON.parse(localStorage.getItem('templates') || '[]')
let users = JSON.parse(localStorage.getItem('users') || '[]') 

async function accepterDemande(demande) {
  if (!useSQL) {
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
    try {
      const sqlUpdateTemplate = "UPDATE templates SET type = 'prestataireValide' WHERE id = ?"
      await executeSQL(sqlUpdateTemplate, [demande.id])

      const sqlUpdateUser = "UPDATE users SET role = 'prestataire' WHERE username = ?"
      await executeSQL(sqlUpdateUser, [demande.username])

      return { error: 0, status: 200, data: demande }
    } catch (err) {
      return { error: 1, status: 500, data: 'Erreur lors de la validation de la demande' }
    }
  }
}

async function refuserDemande(demande) {
  if (!useSQL) {
    templates = templates.filter(t => t.id !== demande.id)
    localStorage.setItem('templates', JSON.stringify(templates))
    return { error: 0, status: 200 }
  } else {
     try {
      const sqlDelete = "DELETE FROM templates WHERE id = ?"
      await executeSQL(sqlDelete, [demande.id])
      return { error: 0, status: 200 }
    } catch (err) {
      return { error: 1, status: 500, data: 'Erreur lors du refus de la demande' }
    }
  }
}

export default { accepterDemande, refuserDemande }
