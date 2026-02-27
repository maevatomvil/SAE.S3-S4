import {v4 as uuidv4} from 'uuid'
import authData from '@/datasource/auth.json'
import competitions from '@/datasource/competitions.json'
import api from "@/services/axios.service.js"

const useSQL = false; //doit etre pareil que le usql de competitions.service.js et competitions.js

let authUsers = JSON.parse(JSON.stringify(authData))
let compUsers = useSQL ? [] : JSON.parse(JSON.stringify(competitions))

const placesParLieu = {
    "Stadium Wuhu": 500,
    "Golf Wuhu": 300,
    "Terrain de tir à l'arc": 200,
    "Piste de cyclisme": 300,
    "Rivière Wuhu": 1
}

function initAuthUsers() {
    const saved = localStorage.getItem('auth')
    if (saved) {
        try {
            const localUsers = JSON.parse(saved)
            authUsers = localUsers
            
        } catch (e) {
            console.error('Erreur lors du chargement des utilisateurs:', e)
        }
    } else {
        localStorage.setItem('auth', JSON.stringify(authUsers))
    }
}

function initCompUsers() {
    const saved = localStorage.getItem('competitions')
    if (saved) {
        try {
            const localComps = JSON.parse(saved)

            compUsers = competitions.map(c => {
                const savedComp = localComps.find(
                    s => s.titre === c.titre && s.jour === c.jour && s.heure === c.heure
                )
                return savedComp ? savedComp : c
            })

            localComps.forEach(s => {
                if (!compUsers.some(c => c.titre === s.titre && c.jour === s.jour && c.heure === s.heure)) {
                    compUsers.push(s)
                }
            })

        } catch (e) {
            console.error('Erreur lors du chargement des compétitions:', e)
            compUsers = JSON.parse(JSON.stringify(competitions))
        }
    } else {
        localStorage.setItem('competitions', JSON.stringify(compUsers))
    }
}


if (!useSQL) {
    initAuthUsers()
    initCompUsers()
}

if (!authUsers.find(u => u.username === "demo01")) {
    const hashed = await hashPassword("1234")
    authUsers.push({
        firstname: "Prestataire",
        surname: "Démo",
        username: "demo01",
        email: "demo@site.com",
        password: hashed,
        role: "prestataire",
        session: null
    })
    localStorage.setItem("auth", JSON.stringify(authUsers))
}

async function login(data) {
    if (!useSQL) {

        if ((!data.username) || (!data.password))
            return {error: 1, status: 404, data: 'aucun login/pass fourni'}

        let user = authUsers.find(e => e.username === data.username)
        if (!user)
            return {error: 1, status: 404, data: 'login/pass incorrect'}

        const hashedPassword = await hashPassword(data.password)

        if (user.password !== hashedPassword)
            return {error: 1, status: 404, data: 'login/password incorrect'}

        if (!user.session) {
            user.session = uuidv4()
            localStorage.setItem('auth', JSON.stringify(authUsers))
        }
        let u = {
            username: user.username,
            email: user.email,
            role: user.role,
            session: user.session
        }
        localStorage.setItem('currentUser', JSON.stringify(u))
        return {error: 0, status: 200, data: u}
    } 
}

async function checkSession() {
    const currentUser = localStorage.getItem('currentUser')

    if (!currentUser) {
        return {error: 1, status: 401, data: 'Non connecté'}
    }

    try {
        const userData = JSON.parse(currentUser)

        const user = authUsers.find(e => e.username === userData.username && e.session === userData.session)

        if (!user) {
            localStorage.removeItem('currentUser')
            return {error: 1, status: 401, data: 'Session invalide'}
        }

        return {error: 0, status: 200, data: userData}
    } catch (e) {
        localStorage.removeItem('currentUser')
        return {error: 1, status: 401, data: 'Erreur de session'}
    }
}

async function logout() {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser)
            const user = authUsers.find(e => e.username === userData.username)
            if (user) {
                delete user.session
                localStorage.setItem('auth', JSON.stringify(authUsers))
            }
        } catch (e) {
            console.error('Erreur lors de la déconnexion:', e)
        }

        localStorage.removeItem('currentUser')

        return {error: 0, status: 200, data: 'Déconnecté avec succès'}
    }
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function signup(data) {
    if (!useSQL) {
        if (!data.firstname || !data.surname || !data.username || !data.email || !data.password) {
            return {error: 1, status: 400, data: 'Tous les champs sont obligatoires !'}
        }

        const existingUser = authUsers.find(e => e.username === data.username)
        if(existingUser) {
            return {error: 1, status: 409, data: 'Ce nom d\'utilisateur existe déjà'}
        }

        const existingEmail = authUsers.find(e => e.email === data.email)
        if(existingEmail) {
            return {error: 1, status: 409, data: 'Cet email est déjà utilisé'}
        }

        const hashedPassword = await hashPassword(data.password)

        const newUser = {
            firstname: data.firstname,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: hashedPassword,
            role: 'visiteur',
            session: uuidv4()
        }

        authUsers.push(newUser)

        localStorage.setItem('auth', JSON.stringify(authUsers))

        const userData = {
            firstname: newUser.firstname,
            surname: newUser.surname,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            session: newUser.session
        }

        localStorage.setItem('currentUser', JSON.stringify(userData))
        return {error: 0, status: 200, data: userData}

    } 
}

export async function getUsers() {
    if (!useSQL) {
        return authUsers.map(u => ({
            username: u.username,
            email: u.email,
            role: u.role
        }))
    } 
}

export async function getCompetitions() {
    if (!useSQL) {
        const savedCompetitions = JSON.parse(localStorage.getItem('competitions')) || []
        const merged = competitions.map(c => {
            const saved = savedCompetitions.find(s => s.titre === c.titre && s.jour === c.jour && s.heure === c.heure)
            return saved ? saved : c
        })
        savedCompetitions.forEach(s => {
            if (!merged.some(c => c.titre === s.titre && c.jour === s.jour && c.heure === s.heure)) {
                merged.push(s)
            }
        })
        return {error: 0, status: 200, data: merged}
    }else {
        const res = await api.get("/competitions")
        return res.data
}

}




export function getCompetitionsMatin(competitions, jour) {
    return competitions
        .filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) < 12)
        .sort((a, b) => a.heure.localeCompare(b.heure))
}

export function getCompetitionsApresMidi(competitions, jour) {
    return competitions
        .filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) >= 12)
        .sort((a, b) => a.heure.localeCompare(b.heure))
}


export async function ajouterCompetition(newCompet, competitionsParam) {
    if (!newCompet.titre || !newCompet.heure || !newCompet.lieu || !newCompet.jour) return

    if (!useSQL) {
        const competToAdd = {
            ...newCompet,
            joueurs: []
        }

        competitionsParam.push(competToAdd)

        if (!compUsers.some(c => c.titre === competToAdd.titre && c.jour === competToAdd.jour && c.heure === competToAdd.heure)) {
            compUsers.push(competToAdd)
            localStorage.setItem('competitions', JSON.stringify(compUsers))
        }
    } else {
        await api.post("/competitions", newCompet)
    }
}


let inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || {}
let numerosInscription = JSON.parse(localStorage.getItem("numerosInscription")) || {}

function saveToLocalStorage() {
    localStorage.setItem("inscriptions", JSON.stringify(inscriptions))
    localStorage.setItem("numerosInscription", JSON.stringify(numerosInscription))
}

export async function getInscriptions() {
    if (!useSQL) {
        return inscriptions
    } else {
        const res = await api.get("/inscriptions")
        return res.data
    }
}



export async function getNumero(titre, jour, heure, username) {

    if (!useSQL) {
        try {
            const current = JSON.parse(localStorage.getItem('currentUser') || 'null')
            if (!current) return null
            if (inscriptions[titre] && inscriptions[titre][current.username]) {
                return inscriptions[titre][current.username]
            }
            return null
        } catch (e) {
            return null
        }
    } else {
        const res = await api.get(`/inscriptions/${titre}/${jour}/${heure}/numero/${username}`)

        return res.data.data
    }
}



export async function inscrireUser(compet, user) {
    if (!useSQL) {
        const index = compUsers.findIndex(c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure)
        if (index === -1) return null

        const comp = compUsers[index]

        if (!comp.joueurs) comp.joueurs = []
        if (!comp.joueurs.find(j => j.username === user.username)) {
            comp.joueurs.push({
                username: user.username,
                firstname: user.firstname,
                surname: user.surname
            })
        }

        if (!inscriptions[comp.titre]) inscriptions[comp.titre] = {}
        let numero
        do {
            numero = Math.floor(Math.random() * 99999) + 1
        } while (Object.values(inscriptions[comp.titre]).includes(numero))
        inscriptions[comp.titre][user.username] = numero
        numerosInscription[comp.titre] = numero

        compUsers[index] = comp
        localStorage.setItem('competitions', JSON.stringify(compUsers))
        localStorage.setItem('inscriptions', JSON.stringify(inscriptions))
        localStorage.setItem('numerosInscription', JSON.stringify(numerosInscription))

        return numero
    } else {
        const res = await api.post("/inscriptions", {
            titre: compet.titre,
            jour: compet.jour,
            heure: compet.heure,
            username: user.username
        })

        return res.data.data
    }

}


export async function desinscrireUser(compet, user) {
  if (!useSQL) {
    const index = compUsers.findIndex(c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure)
    if (index === -1) return null

    const comp = compUsers[index]
    if (comp.joueurs) {
      comp.joueurs = comp.joueurs.filter(j => j.username !== user.username)
    }

    if (inscriptions[compet.titre]) {
      delete inscriptions[compet.titre][user.username]
      if (Object.keys(inscriptions[compet.titre]).length === 0) {
        delete inscriptions[compet.titre]
      }
    }
    delete numerosInscription[compet.titre]

    compUsers[index] = comp
    localStorage.setItem('competitions', JSON.stringify(compUsers))
    localStorage.setItem('inscriptions', JSON.stringify(inscriptions))
    localStorage.setItem('numerosInscription', JSON.stringify(numerosInscription))
    return true
  } else {
       await api.delete("/inscriptions", {
            data: {
                titre: compet.titre,
                jour: compet.jour,
                heure: compet.heure,
                username: user.username
            }
        })
        return true
    }

}



export async function supprimerCompetition(compet) {
    if (!useSQL) {
        const index = compUsers.findIndex(c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure)
        if (index !== -1) {
            compUsers.splice(index, 1)
        }
        if (inscriptions[compet.titre]) {
            delete inscriptions[compet.titre]
        }
        if (numerosInscription[compet.titre]) {
            delete numerosInscription[compet.titre]
        }
        localStorage.setItem('competitions', JSON.stringify(compUsers))
        localStorage.setItem('inscriptions', JSON.stringify(inscriptions))
        localStorage.setItem('numerosInscription', JSON.stringify(numerosInscription))
    } else {
        await api.delete("/competitions", {
            data: {
                titre: compet.titre,
                jour: compet.jour,
                heure: compet.heure
            }
        })
        return true
    }

}

export function getPlacesMaxLieu(lieu) {
    return placesParLieu[lieu] ?? 50
}

export async function getPlacesRestantes(compet) {
    if (!useSQL) {
        const inscriptions = getInscriptions()[compet.titre] || {}
        const reservees = Object.keys(inscriptions).length
        const max = getPlacesMaxLieu(compet.lieu)
        return max - reservees
    } else {
        const res = await api.get(`/competitions/${compet.titre}/places-restantes`)
        return res.data.data
    }
}




export async function syncNumeroWithBackend(compet, username) {
  console.log("SYNC CALL:", compet.titre, compet.jour, compet.heure, username)
   console.log("COMPET OBJ:", compet)


  if (!useSQL) {
    return null
  }

  const numero = await getNumero(compet.titre, compet.jour, compet.heure, username)

  console.log("SYNC RESULT:", numero)
  
  return numero
}








function getSpectateursLocal() {
  return JSON.parse(localStorage.getItem("spectateurs") || "{}")
}

function saveSpectateursLocal(data) {
  localStorage.setItem("spectateurs", JSON.stringify(data))
}

export async function getSpectateurs() {
  if (!useSQL) {
    return getSpectateursLocal()
  }
  const res = await api.get("/spectateurs")
  return res.data.data
}

export async function inscrireSpectateur(compet, user) {
  if (!useSQL) {
    const spectateurs = getSpectateursLocal()
    const key = compet.titre

    if (!spectateurs[key]) spectateurs[key] = {}
    let numero
    do {
      numero = Math.floor(Math.random() * 99999) + 1
    } while (Object.values(spectateurs[key]).includes(numero))
    spectateurs[key][user.username] = numero
    saveSpectateursLocal(spectateurs)
    return numero
  }
  const res = await api.post("/spectateurs", {
    titre: compet.titre,
    jour: compet.jour,
    heure: compet.heure,
    username: user.username
  })
  return res.data.data
}

export async function desinscrireSpectateur(compet, user) {
  if (!useSQL) {
    const spectateurs = getSpectateursLocal()
    const key = compet.titre

    if (spectateurs[key]) {
      delete spectateurs[key][user.username]
      saveSpectateursLocal(spectateurs)
    }
    return true
  }
  await api.delete("/spectateurs", {
    data: {
      titre: compet.titre,
      jour: compet.jour,
      heure: compet.heure,
      username: user.username
    }
  })
  return true
}

export async function syncNumeroSpectateurWithBackend(compet, username) {
  if (!useSQL) return null
  const res = await api.get(
  `/spectateurs/${encodeURIComponent(compet.titre)}/${compet.jour}/${compet.heure}/numero/${username}`
    )

  
  return res.data.data
}








export async function getSpectateursForCompet(compet) {
  if (!useSQL) {
    const all = getSpectateursLocal()
    return all[compet.titre] || {}
  }
  const res = await api.get(`/spectateurs/${encodeURIComponent(compet.titre)}/${compet.jour}/${compet.heure}`)
  return res.data.data
}


export async function getSpectateursList(compet) {
  if (!useSQL) {
    const all = getSpectateursLocal()
    const data = all[compet.titre] || {}
    return Object.entries(data).map(([username, numero]) => ({
      username,
      numero
    }))
  }
  const res = await api.get(`/spectateurs/${encodeURIComponent(compet.titre)}/${compet.jour}/${compet.heure}`)
  return res.data.data
}


export async function getSpectateursCount(compet) {
  if (!useSQL) {
    const all = getSpectateursLocal()
    return Object.keys(all[compet.titre] || {}).length
  }
  const res = await api.get(`/spectateurs/${compet.titre}/${compet.jour}/${compet.heure}/count`)
  return res.data.data
}




export default {
    login,
    checkSession,
    logout,
    signup,
    getUsers,
    getCompetitions,
    getInscriptions,
    getNumero,
    inscrireUser,
    desinscrireUser,
    getCompetitionsMatin,
    getCompetitionsApresMidi,
    ajouterCompetition,
    supprimerCompetition,
    getPlacesMaxLieu,
    getPlacesRestantes,
    syncNumeroWithBackend,
    getSpectateurs,
    inscrireSpectateur,
    desinscrireSpectateur,
    syncNumeroSpectateurWithBackend,
    getSpectateursForCompet,
    getSpectateursList,
    getSpectateursCount

}
