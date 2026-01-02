
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/stores/auth.js'

const useSQL = false

let prestatairesPlanning = JSON.parse(localStorage.getItem('prestatairesPlanning') || '[]')

function initPrestatairesPlanning() {
    if (!localStorage.getItem('prestatairesPlanning')) {
        localStorage.setItem('prestatairesPlanning', JSON.stringify(prestatairesPlanning))
    }
}

if (!useSQL) initPrestatairesPlanning()

let inscriptions = JSON.parse(localStorage.getItem('prestataireInscriptions') || '{}')
let numerosInscription = JSON.parse(localStorage.getItem('prestataireNumerosInscription') || '{}')

function saveToLocalStorage() {
    localStorage.setItem('prestatairesPlanning', JSON.stringify(prestatairesPlanning))
    localStorage.setItem('prestataireInscriptions', JSON.stringify(inscriptions))
    localStorage.setItem('prestataireNumerosInscription', JSON.stringify(numerosInscription))
}

export function getPlanningPrestataire(username) {
    if (!useSQL) {
        const planning = prestatairesPlanning.find(p => p.username === username)
        return planning ? planning.events : []
    }
}

export function savePlanningPrestataire(username, events) {
    if (!useSQL) {
        let planning = prestatairesPlanning.find(p => p.username === username)
        if (planning) {
            planning.events = events
        } else {
            planning = { username, events }
            prestatairesPlanning.push(planning)
        }
        saveToLocalStorage()
        return { error: 0, status: 200, data: planning }
    }
}

export function getEventsMatin(events, jour) {
    return events
        .filter(e => e.jour === jour && parseInt(e.heure.split(':')[0]) < 12)
        .sort((a,b) => a.heure.localeCompare(b.heure))
}

export function getEventsApresMidi(events, jour) {
    return events
        .filter(e => e.jour === jour && parseInt(e.heure.split(':')[0]) >= 12)
        .sort((a,b) => a.heure.localeCompare(b.heure))
}

export function ajouterEvenement(newEvent, username) {
    if (!newEvent.titre || !newEvent.heure || !newEvent.lieu || !newEvent.jour) return

    const planning = prestatairesPlanning.find(p => p.username === username)
    const events = planning ? planning.events : []

    const eventToAdd = { ...newEvent, joueurs: [] }
    events.push(eventToAdd)

    savePlanningPrestataire(username, events)
}

export function supprimerEvenement(event, username) {
    const planning = prestatairesPlanning.find(p => p.username === username)
    if (!planning) return

    planning.events = planning.events.filter(
        e => !(e.titre === event.titre && e.jour === event.jour && e.heure === event.heure)
    )

    // Supprimer les inscriptions pour cet événement
    delete inscriptions[event.titre]
    delete numerosInscription[event.titre]

    saveToLocalStorage()
}

// Inscription utilisateur
export async function inscrireUserPrestataire(event, user, username) {
    const planning = prestatairesPlanning.find(p => p.username === username)
    if (!planning) return null

    const index = planning.events.findIndex(
        e => e.titre === event.titre && e.jour === event.jour && e.heure === event.heure
    )
    if (index === -1) return null

    const evt = planning.events[index]
    if (!evt.joueurs) evt.joueurs = []
    if (!evt.joueurs.find(j => j.username === user.username)) {
        evt.joueurs.push({ username: user.username, firstname: user.firstname, surname: user.surname })
    }

    if (!inscriptions[evt.titre]) inscriptions[evt.titre] = {}
    let numero
    do {
        numero = Math.floor(Math.random() * 99999) + 1
    } while (Object.values(inscriptions[evt.titre]).includes(numero))
    inscriptions[evt.titre][user.username] = numero
    numerosInscription[evt.titre] = numero

    planning.events[index] = evt
    saveToLocalStorage()
    return numero
}

// Désinscrire utilisateur
export async function desinscrireUserPrestataire(event, user, username) {
    const planning = prestatairesPlanning.find(p => p.username === username)
    if (!planning) return null

    const index = planning.events.findIndex(
        e => e.titre === event.titre && e.jour === event.jour && e.heure === event.heure
    )
    if (index === -1) return null

    const evt = planning.events[index]
    evt.joueurs = evt.joueurs.filter(j => j.username !== user.username)

    if (inscriptions[evt.titre]) {
        delete inscriptions[evt.titre][user.username]
        if (Object.keys(inscriptions[evt.titre]).length === 0) {
            delete inscriptions[evt.titre]
        }
    }
    delete numerosInscription[evt.titre]

    planning.events[index] = evt
    saveToLocalStorage()
}

// Récupérer inscriptions et numéro
export function getInscriptionsPrestataire() {
    return inscriptions
}

export function getNumeroPrestataire(titre) {
    const current = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!current) return null
    return inscriptions[titre]?.[current.username] || null
}

export default {
    getPlanningPrestataire,
    savePlanningPrestataire,
    getEventsMatin,
    getEventsApresMidi,
    ajouterEvenement,
    supprimerEvenement,
    inscrireUserPrestataire,
    desinscrireUserPrestataire,
    getInscriptionsPrestataire,
    getNumeroPrestataire
}
