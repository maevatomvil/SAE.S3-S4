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
        <router-link class="section" to="/">Accueil</router-link>
        <router-link class="section" to="/page-hotel">Hôtellerie</router-link>
        <router-link class="section" to="/competition">Compétition</router-link>
        <router-link class="section" to="/restauration">Restauration</router-link>
        <router-link class="section" to="/reservation-equipements">
          Réservation d’infrastructures et d’équipements sportifs
        </router-link>
        <button type="button" class="logout-btn">
          <router-link class="login-btn" to="/login">
            <img src="/public/login_24dp_0000F5_FILL0_wght400_GRAD0_opsz24.svg" alt="Connexion" />
          </router-link>
          <p>Se connecter</p>
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
        <router-link class="section" to="/">Accueil</router-link>
        <router-link class="section" to="/page-hotel">Hôtellerie</router-link>
        <router-link class="section" to="/competition">Compétition</router-link>
        <router-link class="section" to="/restauration">Restauration</router-link>
        <router-link class="section" to="/reservation-equipements">
          Réservation d’infrastructures et d’équipements sportifs
        </router-link>
        <button type="button" @click="handleLogout" class="logout-btn">
          <img src="/public/login_24dp_0000F5_FILL0_wght400_GRAD0_opsz24.svg" alt="déconnexion">
          <p>Se déconnecter</p>
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
        <p class="footer-infos">...Situé sur l'île Wuhu...</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuth } from '@/stores/auth.js'
import { computed, onMounted } from 'vue'
import {useRouter} from "vue-router";

const auth = useAuth()
const router = useRouter()
const isAuthenticated = computed(() => auth.isAuthenticated());

onMounted(async () => {
  await auth.initSession()
})

async function handleLogout() {
  await auth.logout();
  await router.push('/');
}

</script>

<style scoped>
* {
  font-family: 'Montserrat';
}

.navbar {
  background-color: white;
  border-top: whitesmoke solid 2px;
  border-left: whitesmoke solid 2px;
  height: 104px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  vertical-align: middle;

}

.logout-btn p {
  margin: 0;
  color: #2828e2;
}

.sections-div {
  padding: 30px;
  float: right;
}

.section {
  padding: 40px;
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
  height: 80px;
  width: auto;
}

main {
  min-height: calc(100vh - 300px);
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
</style>