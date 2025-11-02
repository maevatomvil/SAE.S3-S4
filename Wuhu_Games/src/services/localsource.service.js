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

if (!useSQL) {
    initAuthUsers()
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
        const competitions = compUsers.map(u => ({
            jour: u.jour,
            heure: u.heure,
            titre: u.titre,
            lieu: u.lieu
        }))
        return {error: 0, status: 200, data: competitions}
    }
    else {
        const sql = 'SELECT jour, heure, titre, lieu FROM competitions'
        const datas = await executeSQL(sql)
        return {error: 0, status: 200, data: datas}
    }
}

export default {
    login,
    checkSession,
    logout,
    signup,
    getUsers,
    getCompetitions
}
