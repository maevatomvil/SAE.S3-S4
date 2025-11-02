import LocalSource from "@/services/localsource.service.js";

async function loginFromLocalSource(data) {
    return LocalSource.login(data);
}

async function logoutFromLocalSource(data) {
    return LocalSource.logout(data);
}

async function checkSessionFromLocalSource(data) {
    return LocalSource.checkSession(data);
}

async function signupFromLocalSource(data) {
    return LocalSource.signup(data);
}

async function login(data) {
    let response = null;
    try {
        response = await loginFromLocalSource(data);
    } catch(err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de se connecter' }
    }
    return response
}

async function signup(data) {
    let response = null;
    try {
        response = await signupFromLocalSource(data);
    } catch(err) {
        response = {error: 1, status: 500, data: 'erreur réseau, impossible de créer le compte'}
    }
    return response
}

async function checkSession() {
    let response = null;
    try {
        response = await checkSessionFromLocalSource();
    } catch(err) {
        response = {error: 1, status: 401, data: 'erreur lors de la vérification de session'}
    }
    return response
}

async function logout() {
    let response = null;
    try {
        response = await logoutFromLocalSource();
    } catch(err) {
        response = {error: 1, status: 500, data: 'erreur lors de la déconnexion'}
    }
    return response
}

export default {
    login,
    signup,
    checkSession,
    logout
}