import TemplateService from './template.service.js'

const useSQL = false

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
    const templates = JSON.parse(localStorage.getItem('templates') || '[]')
    const updatedTemplates = templates.filter(t => t.id !== demande.id)

    localStorage.setItem('templates', JSON.stringify(updatedTemplates))
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
    try {
      const sqlDeleteTemplate = 'DELETE FROM templates WHERE username = ?'
      await executeSQL(sqlDeleteTemplate, [username])
      const sqlUpdateUser = "UPDATE users SET role = 'visiteur' WHERE username = ?"
      await executeSQL(sqlUpdateUser, [username])
      return { error: 0, status: 200 }
    } catch (err) {
      return { error: 1, status: 500, data: 'Erreur lors de la suppression du prestataire' }
    }
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
        ...updatedPrestataire
      }
      localStorage.setItem('templates', JSON.stringify(templates))
      return { error: 0, status: 200 }
    }
    return { error: 1, status: 404 }
  } else {
    try {
      const sqlUpdate = `
        UPDATE templates
        SET 
          name = ?,
          email = ?,
          image = ?,
          shortDescription = ?,
          services = ?
        WHERE username = ? AND type = 'prestataireValide'
      `
      await executeSQL(sqlUpdate, [
        updatedPrestataire.name,
        updatedPrestataire.email,
        updatedPrestataire.image,
        updatedPrestataire.shortDescription,
        JSON.stringify(updatedPrestataire.services),
        updatedPrestataire.username
      ])
      return { error: 0, status: 200 }
    } catch (err) {
      return { error: 1, status: 500 }
    }
  }
}



export default { accepterDemande, refuserDemande, supprimerPrestataire , updatePrestataire}


