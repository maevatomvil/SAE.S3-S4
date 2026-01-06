import { v4 as uuidv4 } from 'uuid'

const useSQL = false

function loadPanier() {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('panier') || '[]')
  } else {
    return []
  }
}

function savePanier(panier) {
  if (!useSQL) {
    localStorage.setItem('panier', JSON.stringify(panier))
  } else {
    return
  }
}

function loadHistorique() {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('historiqueCommandes') || '[]')
  } else {
    return []
  }
}

function saveHistorique(h) {
  if (!useSQL) {
    localStorage.setItem('historiqueCommandes', JSON.stringify(h))
  } else {
    return
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
    return []
  }
}

export function supprimerDuPanier(id) {
  if (!useSQL) {
    const panier = loadPanier().filter(a => a.id !== id)
    savePanier(panier)
    return panier
  } else {
    return []
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
    return { commande: null, historique: [] }
  }
}

export default {
  getPanier,
  ajouterAuPanier,
  supprimerDuPanier,
  getHistorique,
  finaliserCommande
}
