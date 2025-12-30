<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poetsen+One&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

  <header>
    <div v-if="!isAuthenticated" class="navbar">
      <div class="image-div">
        <router-link to="/">
          <img src="/public/Wuhu Games.svg" alt="logo Wuhu Games" />
        </router-link>
      </div>

      <div class="sections-div">
        <router-link class="section" to="/">{{ isEnglish ? 'Home' : 'Accueil' }}</router-link>
        <router-link class="section" to="/page-hotel">{{ isEnglish ? 'Hotels' : 'Hôtellerie' }}</router-link>
        <router-link class="section" to="/competition">{{ isEnglish ? 'Competition' : 'Compétition' }}</router-link>
        <div class="section dropdown">
        <span>{{ isEnglish ? 'Vendors' : 'Prestataires' }}</span>
          <div class="dropdown-content">
            <router-link  to="/addPrestataire">{{ isEnglish ? 'Become a Vendor' : 'Devenir Prestataire' }}</router-link>
            <router-link to="/restauration">{{ isEnglish ? 'Food & Drinks' : 'Restauration' }}</router-link>
            <router-link to="/reservation-equipements">{{ isEnglish ? 'Book infrastructures & sports equipment' : 'Réservation d’infrastructures et d’équipements sportifs' }}</router-link>
            <div v-for="prestataire in prestataires" :key="prestataire.username">
              <router-link :to="`/prestataire/${prestataire.username}`">
                {{ prestataire.name }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="lang-switch">
          <span :class="{ active: !isEnglish }">FR</span>
          <label class="switch">
            <input type="checkbox" v-model="isEnglish" @change="toggleLanguage">
            <span class="slider"></span>
          </label>
          <span :class="{ active: isEnglish }">EN</span>
        </div>
        <button type="button" class="logout-btn">
          <router-link class="login-btn" to="/login">
            <img src="/public/login_24dp_0000F5_FILL0_wght400_GRAD0_opsz24.svg" alt="Connexion" />
          </router-link>
          <p>{{ isEnglish ? 'Login' : 'Se connecter' }}</p>
        </button>
      </div>
    </div>

    <div v-if="isAuthenticated" class="navbar">
      <div class="image-div">
        <router-link to="/">
          <img src="/public/Wuhu Games.svg" alt="logo Wuhu Games" />
        </router-link>
      </div>

      <div class="sections-div">
        <router-link class="section" to="/">{{ isEnglish ? 'Home' : 'Accueil' }}</router-link>
        <router-link class="section" to="/page-hotel">{{ isEnglish ? 'Hotels' : 'Hôtellerie' }}</router-link>
        <router-link class="section" to="/competition">{{ isEnglish ? 'Competition' : 'Compétition' }}</router-link>
        <div class="section dropdown">
        <span>{{ isEnglish ? 'Vendors' : 'Prestataires' }}</span>
          <div class="dropdown-content">
            <router-link  v-if="peutDevenirPrestataire"  to="/addPrestataire">{{ isEnglish ? 'Become a Vendor' : 'Devenir Prestataire' }}</router-link>
            <router-link to="/restauration">{{ isEnglish ? 'Food & Drinks' : 'Restauration' }}</router-link>
            <router-link to="/reservation-equipements">{{ isEnglish ? 'Book infrastructures & sports equipment' : 'Réservation d’infrastructures et d’équipements sportifs' }}</router-link>
            <router-link v-if="auth.authUser?.role === 'organisateur'" to="/prestataire-demandes">
              {{ isEnglish ? 'Vendor Requests' : 'Demande de prestation' }}
            </router-link>
            
            <div v-for="prestataire in prestataires" :key="prestataire.username">
              <router-link :to="`/prestataire/${prestataire.username}`">
                {{ prestataire.name }}
              </router-link>
                <button v-if="auth.authUser?.role === 'organisateur'  || auth.authUser?.username === prestataire.username " @click="supprimerPrestataire(prestataire)">
              Supprimer
            </button>
            </div>
          </div>
        </div>
         <div class="lang-switch">
          <span :class="{ active: !isEnglish }">FR</span>
          <label class="switch">
            <input type="checkbox" v-model="isEnglish" @change="toggleLanguage">
            <span class="slider"></span>
          </label>
          <span :class="{ active: isEnglish }">EN</span>
        </div>
        <div class="user-info" v-if="isAuthenticated">
          <p class="username">{{ auth.authUser?.username }}</p>
        </div>
        <button type="button" @click="handleLogout" class="logout-btn">
          <img src="/public/login_24dp_0000F5_FILL0_wght400_GRAD0_opsz24.svg" alt="déconnexion">
          <p>{{ isEnglish ? 'Logout' : 'Se déconnecter' }}</p>
        </button>
      </div>
    </div>
  </header>

  <main>
    <router-view></router-view>
  </main>

  <footer>
    <div class="footer">
      <div class="div-footer-infos">
        <p class="footer-infos">{{ isEnglish ? "Wuhu Games, the yearly meetup at Wuhu Island" : "Wuhu Games, le rendez-vous annuel de l'île Wuhu" }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuth } from '@/stores/auth.js'
import { computed, onMounted , ref} from 'vue'
import { useRouter } from "vue-router"
import { useLanguageStore } from '@/stores/languageStore.js' 
import PrestataireService from '@/services/prestataire.service.js'
import PrestataireMenuService from '@/services/prestataireMenu.service.js'
const prestataires = ref([])
const auth = useAuth()
const router = useRouter()
const isAuthenticated = computed(() => auth.isAuthenticated())

onMounted(async () => {
  await auth.initSession()
  const res = await PrestataireMenuService.getPrestatairesValides()
  if (res.error === 0) {
    prestataires.value = res.data
  }
})


async function supprimerPrestataire(prestataire) {
  const res = await PrestataireService.supprimerPrestataire(prestataire.username)
  if (res.error === 0) {
    prestataires.value = prestataires.value.filter(p => p.username !== prestataire.username)
  } else {
    alert('Erreur lors de la suppression du prestataire')
  }
}



async function handleLogout() {
  await auth.logout()
  await router.push('/')
}

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)
function toggleLanguage() {
  languageStore.toggleLanguage()
}


const peutDevenirPrestataire = computed(() => {
  if (!isAuthenticated.value) return false
  const username = auth.authUser?.username
  return !prestataires.value.some(p => p.username === username)
})




</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  background-color: #ffffff;
}
</style>




<style scoped>

* {
  font-family: 'Montserrat';
}


html, body {
  height: 100%;
  margin: 0;
}

body {
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;           
  padding-top: 120px;
}



.navbar {
  position: fixed;
  width: calc(100% - 20px);
  margin: 10px;
  border-radius: 52px;
  background-color: white;
  height: 100px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  vertical-align: middle;
}

.logout-btn p {
  margin: 0;
  color: #2828e2;
}

.sections-div {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  white-space: nowrap;
}

.section {
  padding: 20px 40px;
  font-size: 20px;
  text-decoration: none;
  color: #2828e2;
  font-weight: bold;
}

.image-div {
  float: left;
  padding: 10px;
}

.image-div img {
  height: 75px;
  width: auto;
  padding-left: 2.5px;
}

main {
  min-height: calc(100vh - 300px);
}

.username {
  margin: 0 10px 0 0;
  font-weight: bold;
  color: #2828e2;
}
.footer {
  height: 200px;
  background-color: #5858d8;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-top: auto;
}

.footer-infos {
  color: white;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 25px;
  font-weight: bold;
  color: #2828e2;
}

.lang-switch span.active {
  color: #000;
}

.switch {
  position: relative;
  width: 45px;
  height: 22px;
  display: inline-block;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  background-color: #ccc;
  border-radius: 34px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  background-color: white;
  border-radius: 50%;
  left: 2px;
  bottom: 2px;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #2828e2;
}

input:checked + .slider:before {
  transform: translateX(23px);
}






.dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 250px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 100;
  flex-direction: column;
}

.dropdown-content a {
  padding: 10px 20px;
  text-decoration: none;
  color: #2828e2;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: flex;
}

</style>
