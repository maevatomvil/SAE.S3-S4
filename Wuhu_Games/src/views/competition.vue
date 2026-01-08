<template>
    <div class="titre">
        <h1>
            <span v-if="!isEnglish">Réservations et inscriptions aux compétitions</span>
            <span v-else>Reservations and competition registrations</span>
        </h1>
    </div>

    <div class="presentation"> 
        <p>
            <span v-if="!isEnglish">
                Sur cette page vous pourrez voir les planning des compétions, vous inscrire dans une équipe pour une compétition ou réserver une place en tant que spectateur.
            </span>
            <span v-else>
                On this page you can view competition schedules, register in a team for a competition, or book a seat as a spectator.
            </span>
        </p>

        <img src="/public/image_basket.jpg" alt="Basketball match image"/>
    </div>

    <div class="presentation_services">
      <h3>
        <span v-if="!isEnglish">Nos services :</span>
        <span v-else>Our services:</span>
      </h3>

      <div class="services_cards">

        <router-link to="/planning-competitions" class="service_card service_link">
          <p>
            <span v-if="!isEnglish">Planning des compétitions | Inscription</span>
            <span v-else>Competition planning | Registration</span>
          </p>
        </router-link>

        <router-link to="/planning-spectateurs" class="service_card service_link">
          <p>
            <span v-if="!isEnglish">Réserver une place spectateur</span>
            <span v-else>Book a spectator seat</span>
          </p>
        </router-link>

      </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/languageStore.js'

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)
</script>

<style scoped>
.titre h1 {
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
}

.titre {
  text-align: center;
  padding: 20px;
}

.presentation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.presentation p {
  flex: 1;
  text-align: left;
  font-size: 1.1em;
  line-height: 1.6;
  color: #444;
  text-align: justify;
}

.presentation img {
  flex: 1;
  max-width: 60%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.presentation_services {
  background-color: rgb(255, 255, 255);
  padding: 20px;
  max-width: 900px;
  margin: 30px auto;
  border-radius: 8px;
  text-align: center;
}

.presentation_services h3 {
  margin-bottom: 20px;
}

.services_cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.service_card {
  background: #5858d8;
  padding: 20px 25px;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
  width: 250px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.service_card p {
  margin: 0;
  font-size: 1.05em;
  font-weight: 600;
  color: #ffffff;
}

.service_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.25);
}

.service_link {
  text-decoration: none;
  color: inherit;
}
</style>

<style>
* {
  font-family: 'Montserrat';
  text-decoration: none;
}
</style>
