import api from "@/services/axios.service.js"
import { v4 as uuidv4 } from 'uuid'
const useSQL = false
export async function getPanier(username, prestataireUsername) {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('panier_' + username + '_' + prestataireUsername) || '[]')
  } else {
    const res = await api.get(`/boutique/panier/${username}/${prestataireUsername}`)
    return res.data.data
  }
}
export async function savePanier(username, prestataireUsername, panier) {
  if (!useSQL) {
    localStorage.setItem('panier_' + username + '_' + prestataireUsername, JSON.stringify(panier))
  } else {
    await api.post(`/boutique/panier/${username}/${prestataireUsername}`, { panier })
  }
}
export async function removePanier(username, prestataireUsername) {
  if (!useSQL) {
    localStorage.removeItem('panier_' + username + '_' + prestataireUsername)
  } else {
    await api.delete(`/boutique/panier/${username}/${prestataireUsername}`)
  }
}
export async function getHistorique(username, prestataireUsername) {
  if (!useSQL) {
    return JSON.parse(localStorage.getItem('historiqueCommandes_' + username + '_' + prestataireUsername) || '[]')
  } else {
    const res = await api.get(`/boutique/historique/${username}/${prestataireUsername}`)
    return res.data.data
  }
}
export async function saveHistorique(username, prestataireUsername, historique) {
  if (!useSQL) {
    localStorage.setItem('historiqueCommandes_' + username + '_' + prestataireUsername, JSON.stringify(historique))
  } else {
    await api.post(`/boutique/historique/${username}/${prestataireUsername}`, { historique })
  }
}
export async function finaliserCommande(panier, username, prestataireUsername) {
  const groupe = {}
  for (const item of panier) {
    if (!groupe[item.id]) groupe[item.id] = { ...item, quantite: 1 }
    else groupe[item.id].quantite++
  }
  const commande = {
    id: uuidv4(),
    date: new Date().toLocaleString(),
    username,
    prestataireUsername,
    articles: Object.values(groupe)
  }
  if (!useSQL) {
    const historique = await getHistorique(username, prestataireUsername)
    historique.push(commande)
    await saveHistorique(username, prestataireUsername, historique)
    await removePanier(username, prestataireUsername)
    const allOrders = JSON.parse(localStorage.getItem("allOrders") || "[]")
    allOrders.push(commande)
    localStorage.setItem("allOrders", JSON.stringify(allOrders))
  } else {
    await api.post(`/boutique/commandes`, { commande })
  }
  return commande
}
export default { getPanier, savePanier, removePanier, getHistorique, saveHistorique, finaliserCommande }