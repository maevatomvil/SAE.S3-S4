import {v4 as uuidv4} from 'uuid'
import authData from '@/datasource/auth.json'
import competitions from '@/datasource/competitions.json'

const useSQL = false;

let authUsers = JSON.parse(JSON.stringify(authData))
let compUsers = JSON.parse(JSON.stringify(competitions))

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

            // Fusionner les compétitions JSON avec celles du localStorage en gardant les joueurs
            compUsers = competitions.map(c => {
                const savedComp = localComps.find(
                    s => s.titre === c.titre && s.jour === c.jour && s.heure === c.heure
                )
                return savedComp ? savedComp : c
            })

            // Ajouter les compétitions locales qui n’existent pas dans le JSON
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
    } else {
        const sql = 'SELECT username, email, role FROM users WHERE username = ? AND password = ?'
        const datas = await executeSQL(sql, [data.username, hashPassword(data.password)])
        if (datas.length === 0) {
            return {error: 1, status: 404, data: 'Login/password incorrect'}
        }
        const userData = {...datas[0], session: uuidv4()}
        localStorage.setItem('currentUser', JSON.stringify(userData))
        return {error: 0, status: 200, data: userData}
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

    } else {
        const sql = 'INSERT INTO users (firstname, surname, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)'
        const hashedPassword = hashPassword(authData.password)
        const role = 'visiteur'

        try {
            await executeSQL(sql, [authData.firstname, authData.surname, authData.username, authData.email, hashedPassword, role])
            const userData = {
                firstname: authData.firstname,
                surname: authData.surname,
                username: authData.username,
                email: authData.email,
                role: role,
                session: uuidv4()
            }
            localStorage.setItem('currentUser', JSON.stringify(userData))
            return {error: 0, status: 201, data: userData}
        } catch (err) {
            return {error: 1, status: 500, data: 'Erreur lors de la création du compte'}
        }
    }
}

export async function getUsers() {
    if (!useSQL) {
        return authUsers.map(u => ({
            username: u.username,
            email: u.email,
            role: u.role
        }))
    } else {
        const sql = 'SELECT username, email, role FROM users'
        const datas = await executeSQL(sql)
        return datas
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
    } else {
        const sql = 'SELECT jour, heure, titre, lieu FROM competitions'
        const datas = await executeSQL(sql)
        return {error: 0, status: 200, data: datas}
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


export function ajouterCompetition(newCompet, competitionsParam) {
    if (!newCompet.titre || !newCompet.heure || !newCompet.lieu || !newCompet.jour) return
    const competToAdd = {
        ...newCompet,
        joueurs: []
    }

    competitionsParam.push(competToAdd)

    if (!compUsers.some(c => c.titre === competToAdd.titre && c.jour === competToAdd.jour && c.heure === competToAdd.heure)) {
        compUsers.push(competToAdd)
        localStorage.setItem('competitions', JSON.stringify(compUsers))
    }
}


let inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || {}
let numerosInscription = JSON.parse(localStorage.getItem("numerosInscription")) || {}

function saveToLocalStorage() {
    localStorage.setItem("inscriptions", JSON.stringify(inscriptions))
    localStorage.setItem("numerosInscription", JSON.stringify(numerosInscription))
}

export function getInscriptions() {
    if (!useSQL) {
        return inscriptions
    } else {
        return executeSQL('SELECT titre, username, numero FROM inscriptions')
            .then(rows => {
                const result = {}
                rows.forEach(r => {
                    if (!result[r.titre]) result[r.titre] = {}
                    result[r.titre][r.username] = r.numero
                })
                return result
            })
    }
}

export function getNumero(titre) {
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
        const current = JSON.parse(localStorage.getItem('currentUser') || 'null')
        if (!current) return Promise.resolve(null)
        return executeSQL('SELECT numero FROM inscriptions WHERE titre = ? AND username = ? LIMIT 1', [titre, current.username])
            .then(rows => rows.length ? rows[0].numero : null)
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
        let numero
        let rows
        do {
            numero = Math.floor(Math.random() * 99999) + 1
            rows = await executeSQL('SELECT numero FROM inscriptions WHERE titre = ? AND numero = ?', [compet.titre, numero])
        } while (rows.length > 0)

        await executeSQL(
            'INSERT INTO inscriptions (titre, username, numero) VALUES (?, ?, ?)',
            [compet.titre, user.username, numero]
        )

        numerosInscription[compet.titre] = numero

        const index = compUsers.findIndex(c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure)
        if (index !== -1) {
            const comp = compUsers[index]
            if (!comp.joueurs) comp.joueurs = []
            if (!comp.joueurs.find(j => j.username === user.username)) {
                comp.joueurs.push({
                    username: user.username,
                    firstname: user.firstname,
                    surname: user.surname
                })
            }
            compUsers[index] = comp
            localStorage.setItem('competitions', JSON.stringify(compUsers))
        }

        return numero
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
    const sqlDelete = 'DELETE FROM inscriptions WHERE titre = ? AND username = ?'
    await executeSQL(sqlDelete, [compet.titre, user.username])

    const index = compUsers.findIndex(c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure)
    if (index !== -1) {
      const comp = compUsers[index]
      if (comp.joueurs) {
        comp.joueurs = comp.joueurs.filter(j => j.username !== user.username)
      }
      compUsers[index] = comp
      localStorage.setItem('competitions', JSON.stringify(compUsers))
    }

    if (inscriptions[compet.titre]) {
      delete inscriptions[compet.titre][user.username]
      if (Object.keys(inscriptions[compet.titre]).length === 0) {
        delete inscriptions[compet.titre]
      }
    }
    delete numerosInscription[compet.titre]
    localStorage.setItem('inscriptions', JSON.stringify(inscriptions))
    localStorage.setItem('numerosInscription', JSON.stringify(numerosInscription))
    
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
        const sqlDeleteInscriptions = 'DELETE FROM inscriptions WHERE titre = ?'
        await executeSQL(sqlDeleteInscriptions, [compet.titre])

        const sqlDeleteCompet = 'DELETE FROM competitions WHERE titre = ? AND jour = ? AND heure = ?'
        await executeSQL(sqlDeleteCompet, [compet.titre, compet.jour, compet.heure])

        const index = compUsers.findIndex(c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure)
        if (index !== -1) {
            compUsers.splice(index, 1)
        }
        if (inscriptions[compet.titre]) delete inscriptions[compet.titre]
        if (numerosInscription[compet.titre]) delete numerosInscription[compet.titre]
        localStorage.setItem('competitions', JSON.stringify(compUsers))
        localStorage.setItem('inscriptions', JSON.stringify(inscriptions))
        localStorage.setItem('numerosInscription', JSON.stringify(numerosInscription))
    }
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
    getCompetitionsMatin,
    getCompetitionsApresMidi,
    ajouterCompetition,
    desinscrireUser
}
 