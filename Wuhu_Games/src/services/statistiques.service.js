const useSQL = false

function loadAllOrders() {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('allOrders') || '[]')
  } else {
    return []
  }
}

function saveAllOrders(all) {
  if (!useSQL) {
    localStorage.setItem('allOrders', JSON.stringify(all))
  } else {
    return
  }
}

export function ajouterCommandeGlobale(commande) {
  if (!useSQL) {
    const all = loadAllOrders()
    all.push(commande)
    saveAllOrders(all)
    return all
  } else {
    return []
  }
}

export function getPanierMoyen(username) {
  if (!useSQL) {
    const all = loadAllOrders().filter(c => c.prestataireUsername === username)
    if (all.length === 0) return 0
    const total = all.reduce((sum, cmd) => {
      const t = cmd.articles.reduce((s, a) => s + a.prix * a.quantite, 0)
      return sum + t
    }, 0)
    return total / all.length
  } else {
    return 0
  }
}

export function getClassementArticles(prestataire) {
  if (!useSQL) {
    const all = loadAllOrders()
    const ventes = {}

    for (const art of prestataire.articles) {
      ventes[art.id] = { titre: art.titre, quantite: 0 }
    }

    for (const cmd of all) {
      if (cmd.prestataireUsername !== prestataire.username) continue
      for (const a of cmd.articles) {
        if (ventes[a.id]) ventes[a.id].quantite += a.quantite
      }
    }

    return Object.values(ventes).sort((a, b) => b.quantite - a.quantite)
  } else {
    return []
  }
}

export function getVuesPageInfo(username) {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('views_' + username) || '[]')
  } else {
    return []
  }
}

export default {
  ajouterCommandeGlobale,
  getPanierMoyen,
  getClassementArticles,
  getVuesPageInfo
}
