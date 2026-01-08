import { v4 as uuidv4 } from 'uuid'

const useSQL = false

function loadPanier() {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('panier') || '[]')
  } else {
    const sql = "SELECT article FROM panier"
    return executeSQL(sql).then(rows =>
      rows.map(r => JSON.parse(r.article))
    )
  }
}

function savePanier(panier) {
  if (!useSQL) {
    localStorage.setItem('panier', JSON.stringify(panier))
  } else {
    const sqlDelete = "DELETE FROM panier"
    return executeSQL(sqlDelete).then(async () => {
      for (const item of panier) {
        const sqlInsert = "INSERT INTO panier (article) VALUES (?)"
        await executeSQL(sqlInsert, [JSON.stringify(item)])
      }
    })
  }
}

function loadHistorique() {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('historiqueCommandes') || '[]')
  } else {
    const sql = "SELECT commande FROM historique"
    return executeSQL(sql).then(rows =>
      rows.map(r => JSON.parse(r.commande))
    )
  }
}

function saveHistorique(h) {
  if (!useSQL) {
    localStorage.setItem('historiqueCommandes', JSON.stringify(h))
  } else {
    const sqlDelete = "DELETE FROM historique"
    return executeSQL(sqlDelete).then(async () => {
      for (const c of h) {
        const sqlInsert = "INSERT INTO historique (commande) VALUES (?)"
        await executeSQL(sqlInsert, [JSON.stringify(c)])
      }
    })
  }
}

export function getPanier() {
  return loadPanier()
}

export function ajouterAuPanier(article, prestataire) {
  if (!useSQL) {
    const panier = loadPanier()
    panier.push(article)
    savePanier(panier)
    return panier
  } else {
    return loadPanier().then(async panier => {
      panier.push(article)
      await savePanier(panier)
      return panier
    })
  }
}

export function supprimerDuPanier(id) {
  if (!useSQL) {
    const panier = loadPanier().filter(a => a.id !== id)
    savePanier(panier)
    return panier
  } else {
    return loadPanier().then(async panier => {
      const updated = panier.filter(a => a.id !== id)
      await savePanier(updated)
      return updated
    })
  }
}

export function getHistorique() {
  return loadHistorique()
}

export function finaliserCommande(panier, username) {
  if (!useSQL) {
    const groupe = {}
    for (const item of panier) {
      if (!groupe[item.id]) groupe[item.id] = { ...item, quantite: 1 }
      else groupe[item.id].quantite++
    }

    const commande = {
      id: uuidv4(),
      date: new Date().toLocaleString(),
      username,
      articles: Object.values(groupe)
    }

    const historique = loadHistorique()
    historique.push(commande)
    saveHistorique(historique)
    savePanier([])

    return { commande, historique }
  } else {
    const groupe = {}
    for (const item of panier) {
      if (!groupe[item.id]) groupe[item.id] = { ...item, quantite: 1 }
      else groupe[item.id].quantite++
    }

    const commande = {
      id: uuidv4(),
      date: new Date().toISOString(),
      username,
      articles: Object.values(groupe)
    }

    return loadHistorique().then(async historique => {
      historique.push(commande)
      await saveHistorique(historique)
      await savePanier([])
      return { commande, historique }
    })
  }
}

export default {
  getPanier,
  ajouterAuPanier,
  supprimerDuPanier,
  getHistorique,
  finaliserCommande
}
