import {ref} from 'vue'
import {defineStore} from 'pinia'

import AuthService from '@/services/auth.service'

export const useAuth = defineStore('auth',() => {
    const authUser = ref(null)

    async function login(data) {
        console.log('login');
        let response = await AuthService.login(data)
        if (response.error == 0) {
            authUser.value = response.data
        } else {
            throw new Error(response.data)
        }
    }

    async function signup(data) {
        console.log('signup');
        let response = await AuthService.signup(data)
        if (response.error == 0) {
            authUser.value = response.data
            return response
        } else {
            throw new Error(response.data)
        }
    }

    function logout() {
        authUser.value = null;
        sessionStorage.removeItem('authUser');
    }

    function isAuthenticated() {
        return authUser.value !== null;
    }

    function hasRole(role) {
        return authUser.value && authUser.value.role === role;
    }

    return { authUser, login, signup, logout, isAuthenticated, hasRole }
})