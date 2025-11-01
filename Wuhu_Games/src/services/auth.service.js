import LocalSource from "@/services/localsource.service.js";

async function loginFromLocalSource(data) {
    return LocalSource.login(data);
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

export default {
    login,
    signup
}