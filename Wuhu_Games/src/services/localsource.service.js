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
        return {error: 0, status: 200, data: u}
    } else {
        const sql = 'SELECT username, email, role FROM users WHERE username = ? AND password = ?'
        const datas = await executeSQL(sql, [data.username, hashPassword(data.password)])
        if (datas.length === 0) {
            return {error: 1, status: 404, data: 'Login/password incorrect'}
        }
        return {error: 0, status: 200, data: {...data[0], session: uuidv4()}}
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

        return {
            error: 0,
            status: 201,
            data: {
                firstname: newUser.firstname,
                surname: newUser.surname,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                session: newUser.session
            }
        }
    } else {
        const sql = 'INSERT INTO users (firstname, surname, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)'
        const hashedPassword = hashPassword(authData.password)
        const role = 'visiteur'

        try {
            await executeSQL(sql, [authData.firstname, authData.surname, authData.username, authData.email, hashedPassword, role])
            return {
                error: 0,
                status: 201,
                data: {
                    firstname: authData.firstname,
                    surname: authData.surname,
                    username: authData.username,
                    email: authData.email,
                    role: role,
                    session: uuidv4()
                }
            }
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
    signup,
    getUsers,
    getCompetitions
}
