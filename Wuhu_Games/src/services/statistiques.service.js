import api from "@/services/axios.service.js"

const useSQL = true

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

export async function getPanierMoyen(username) {
  if (!useSQL) {
    const all = loadAllOrders().filter(c => c.prestataireUsername === username)
    if (all.length === 0) return 0
    const total = all.reduce((sum, cmd) => {
      const t = cmd.articles.reduce((s, a) => s + a.prix * a.quantite, 0)
      return sum + t
    }, 0)
    return total / all.length
  } else {
    const res = await api.get(`/statistiques/commandes/${username}`)
    const commandes = res.data.data
    if (commandes.length === 0) return 0
    const total = commandes.reduce((sum, cmd) => {
      const t = (cmd.articles || []).reduce((s, a) => s + a.prix * a.quantite, 0)
      return sum + t
    }, 0)
    return total / commandes.length
  }
}

export async function getClassementArticles(prestataire) {
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
    const res = await api.get(`/statistiques/commandes/${prestataire.username}`)
    const commandes = res.data.data
    const ventes = {}
    for (const art of prestataire.articles) {
      ventes[art.id] = { titre: art.titre, quantite: 0 }
    }
    for (const cmd of commandes) {
      for (const a of (cmd.articles || [])) {
        if (ventes[a.id]) ventes[a.id].quantite += a.quantite
      }
    }
    return Object.values(ventes).sort((a, b) => b.quantite - a.quantite)
  }
}

export async function getVuesPageInfo(username) {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('views_' + username) || '[]')
  } else {
    const res = await api.get(`/statistiques/views/${username}`)
    return res.data.data
  }
}

export async function addView(username) {
  if (!useSQL) return
  await api.post(`/statistiques/views/${username}`)
}



export async function getLivreDorStats(username) {
  if (!useSQL) {
    return { error: 0, status: 200, data: [] }
  }
  const res = await api.get(`/livre-dor/${username}/stats`)
  return res.data
}


export default {
  ajouterCommandeGlobale,
  getPanierMoyen,
  getClassementArticles,
  getVuesPageInfo,
  addView,
  getLivreDorStats
}