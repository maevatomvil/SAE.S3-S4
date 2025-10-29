import {v4 as uuidv4} from 'uuid'
import authData from '@/datasource/auth.json'
let authUsers = JSON.parse(JSON.stringify(authData))

function login(data) {
    if ((!data.username) || (!data.password))
        return {error: 1, status: 404, data: 'aucun login/pass fourni'}
    let user = authUsers.find(e => e.username === data.username)
    if (!user)
        return {error: 1, status: 404, data: 'login/pass incorrect'}
    if (!user.session) {
        user.session = uuidv4()
    }
    let u = {
        username: user.username,
        email: user.email,
        role: user.role,
        session: user.session
    }
    return {error: 0, status: 200, data: u}
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function signup(data) {
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
        role: data.role || 'visiteur',
        session: uuidv4()
    }

    authUsers.push(newUser)

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
}

export default {
    login,
    signup
}
