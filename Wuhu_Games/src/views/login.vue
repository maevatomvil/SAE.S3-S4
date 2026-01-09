<template>
  <div class="authentification">
    <div class="auth-container">
      <h2 class="auth-title">Connexion</h2>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>Login</label>
          <input v-model="form.username" placeholder="Entrez votre login" required />
        </div>

        <div class="input-group"> <p> ( info pour la personne qui teste le site : mdp de org01 = ouioui)</p>
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" placeholder="Entrez votre mot de passe" required />
        </div>

        <button type="submit" class="btn-login">Se connecter</button>

        <div class="redirect-signup">
          <router-link to="/signup">Vous n'avez pas de compte ?</router-link>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/stores/auth.js'
import {useRouter} from "vue-router";

const form = ref({
  username: '',
  password: ''
})
const errorMessage = ref('')
const auth = useAuth()
const router = useRouter()

async function handleLogin() {
  try {
    await auth.login(form.value)
    await router.push('/')
    if (!auth.authUser) {
      errorMessage.value = "Identifiants incorrects"
    }
  } catch (err) {
    errorMessage.value = "Erreur de connexion"
  }
}
</script>

<style scoped>
.redirect-signup {
  font-size: medium;
}

.authentification {
  position: fixed;            /* reste toujours au centre de l’écran */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;              /* prend toute la hauteur de l’écran */
  display: flex;
  justify-content: center;    /* centre horizontalement */
  align-items: center;        /* centre verticalement */
  background: linear-gradient(to right, #5858d8, #0080ff);  /* optionnel : fond clair */
  z-index: 0;
}

.auth-container {
  background: white;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #0000f5;
}

.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.input-group input {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
}

.btn-login {
  background-color: #0000f5;
  color: white;
  font-weight: 600;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-login:hover {
  background-color: #2828e2;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>