<template>
    <div class="titre">
        <h1>
            <span v-if="!isEnglish">Présentation de l'hôtel</span>
            <span v-else>Hotel presentation</span>
        </h1>
    </div>

    <div class="presentation"> 
        <p>
            <span v-if="!isEnglish">
                Dans cette page, vous pourrez consulter le planning de disponibilité des chambres et en réserver une.
                Notre hôtel allie confort et nature pour accueillir les participants et les spectateurs de l’événement sportif.
                Vous pourrez profiter d’un hébergement moderne, de services adaptés aux athlètes et d’une ambiance conviviale
                pour vivre pleinement cette expérience unique.
            </span>
            <span v-else>
                On this page, you can check room availability and book one.
                Our hotel combines comfort and nature to welcome participants and spectators of the sports event.
                You will enjoy modern accommodation, services adapted to athletes, and a friendly atmosphere
                to fully experience this unique event.
            </span>
        </p>

        <img src="/public/image_chambre_hotel.jpg" alt="Hotel room image"/>
    </div>

    <div class="presentation_services">
        <h3>
            <span v-if="!isEnglish">Nos services :</span>
            <span v-else>Our services:</span>
        </h3>

        <div class="services_cards">

            <div class="service_card">
                <p>
                    <span v-if="!isEnglish">Voir les chambres disponibles</span>
                    <span v-else>View available rooms</span>
                </p>
            </div>

            <router-link to="/reservation-hotel" class="service_card service_link">
                <p>
                    <span v-if="!isEnglish">Réserver</span>
                    <span v-else>Book</span>
                </p>
            </router-link>

            <router-link to="/livre-dor" class="service_card service_link">
                <p>
                    <span v-if="!isEnglish">Consulter le livre d'or</span>
                    <span v-else>View guestbook</span>
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

<style>
*{
  font-family: 'Montserrat';
  text-decoration:none;
}

.titre  {
  text-align: center;
  padding: 20px;
}

.titre h1 {
  margin-bottom: 30px;
  font-size: 2em;
  color: #333;
}

.presentation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.presentation  p {
  flex: 1;
  text-align: left;
  font-size: 1.1em;
  line-height: 1.6;
  color: #444;
  text-align: justify;
}

.presentation  img {
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
