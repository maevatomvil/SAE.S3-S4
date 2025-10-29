<script setup>
import {ref} from 'vue'
import {useAuth} from "@/stores/auth.js";
import {useRouter} from 'vue-router'

const auth = useAuth()
const router = useRouter()
const form = ref({
  firstname: '',
  surname: '',
  username: '',
  email: '',
  password: '',
  role: 'visiteur'
})
const errorMessage = ref('')

async function handleSignup() {
  errorMessage.value = ''
  try {
    await auth.signup(form.value)
    await router.push('/login')
  } catch (err) {
    errorMessage.value = err.message || "Erreur lors de l'inscription"
  }
}
</script>

<template>
  <div class="signup">
    <div class="signup-container">
      <h2 class="signup-title">Créer un compte</h2>

      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="input-group">
          <label>Prénom</label>
          <input v-model="form.firstname" placeholder="Entrez votre prénom" required />
        </div>

        <div class="input-group">
          <label>Nom</label>
          <input v-model="form.surname" placeholder="Entrez votre nom" required />
        </div>

        <div class="input-group">
          <label>Login</label>
          <input v-model="form.username" placeholder="Entrez votre login" required />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="Entrez votre email" required />
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" placeholder="Entrez votre mot de passe" required />
        </div>

        <div class="input-group">
          <label>Rôle</label>
          <select v-model="form.role">
            <option value="visiteur">Visiteur</option>
            <option value="organisateur">Organisateur</option>
            <option value="prestataire">Prestataire</option>
          </select>
        </div>

        <button type="submit" class="btn-signup">S'inscrire</button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.signup {
  position: fixed;            /* reste toujours au centre de l’écran */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;              /* prend toute la hauteur de l’écran */
  display: flex;
  justify-content: center;    /* centre horizontalement */
  align-items: center;        /* centre verticalement */
  background-color: #f5f6fa;  /* optionnel : fond clair */
  z-index: 0;
}

.signup-container {
  background: white;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signup-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #0000f5;
}

.signup-form {
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

.btn-signup {
  background-color: #0000f5;
  color: white;
  font-weight: 600;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-signup:hover {
  background-color: #2828e2;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>