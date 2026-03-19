import api from "@/services/axios.service.js"

const useSQL = true

let inscriptions = JSON.parse(localStorage.getItem("planningPrestataireInscriptions") || "{}")
let numeros = JSON.parse(localStorage.getItem("planningPrestataireNumeros") || "{}")

function saveToLocalStorage() {
  localStorage.setItem("planningPrestataireInscriptions", JSON.stringify(inscriptions))
  localStorage.setItem("planningPrestataireNumeros", JSON.stringify(numeros))
}

export async function inscrireUser(prestataireUsername, eventId, username) {
  if (!useSQL) {
    if (!inscriptions[eventId]) inscriptions[eventId] = {}
    let numero
    do {
      numero = Math.floor(Math.random() * 99999) + 1
    } while (Object.values(inscriptions[eventId]).includes(numero))
    inscriptions[eventId][username] = numero
    numeros[eventId] = numero
    saveToLocalStorage()
    return numero
  } else {
    const res = await api.post("/planning-prestataire", { prestataireUsername, eventId, username })
    return res.data.data
  }
}

export async function desinscrireUser(prestataireUsername, eventId, username) {
  if (!useSQL) {
    if (inscriptions[eventId]) {
      delete inscriptions[eventId][username]
    }
    delete numeros[eventId]
    saveToLocalStorage()
    return true
  } else {
    await api.delete("/planning-prestataire", { data: { prestataireUsername, eventId, username } })
    return true
  }
}

export async function getNumero(prestataireUsername, eventId, username) {
  if (!useSQL) {
    return inscriptions[eventId]?.[username] || null
  } else {
    const res = await api.get(`/planning-prestataire/${prestataireUsername}/${eventId}/numero/${username}`)
    return res.data.data
  }
}

export default { inscrireUser, desinscrireUser, getNumero }