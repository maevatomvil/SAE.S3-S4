<template>
  <div class="titre">
    <h1>
      {{ isEnglish ? "Competition Schedule" : "Planning des compétitions" }}
    </h1>
  </div>


  <div v-if="!auth.authUser">
    <p>Connectez vous pour voir le planning</p>
  </div>

  <div class="planning" v-if="competitions.compUser">
    <div v-for="jour in jours" :key="jour" class="jour">
      <h2>{{ jour }}</h2>

      <div class="periode">
        <h3>Matin</h3>

        <div class="cases">
          <template v-if="getCompetitionsMatin(competitions.compUser, jour).length">
            <div
                v-for="compet in getCompetitionsMatin(competitions.compUser, jour)"
                :key="compet.titre"
                class="case"
            >
              <p><strong>{{ compet.titre }}</strong></p>

              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>

            
              <p>
                {{ isEnglish ? "Remaining spots:" : "Places restantes :" }}
                <strong>{{ getPlacesRestantes(compet) }}</strong>
              </p>

              <button
                  v-if="getPlacesRestantes(compet) > 0 && !getInscriptions()[compet.titre]?.[auth.authUser.username]"
                  @click="ouvrirPopupReservation(compet)"
              >
                Réserver
              </button>

              <button
                  v-else-if="getInscriptions()[compet.titre]?.[auth.authUser.username]"
                  @click="ouvrirPopupReservation(compet)"
              >
                Ma réservation
              </button>

              <p v-else style="color:red;font-weight:bold;">
                Complet
              </p>
            </div>
          </template>

          <div v-else>
            <div class="case vide"></div>
          </div>
        </div>
      </div>

      <div class="periode">
        <h3>Après-midi</h3>

        <div class="cases">
          <template v-if="getCompetitionsApresMidi(competitions.compUser, jour).length">
            <div
                v-for="compet in getCompetitionsApresMidi(competitions.compUser, jour)"
                :key="compet.titre"
                class="case"
            >
              <p><strong>{{ compet.titre }}</strong></p>

              <p
                  v-if="getInscriptions()[compet.titre]?.[auth.authUser.username]"
                  style="color:green;font-weight:bold;"
              >
                Réservé
              </p>

              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>

              
              <p>
                {{ isEnglish ? "Remaining spots:" : "Places restantes :" }}
                <strong>{{ getPlacesRestantes(compet) }}</strong>
              </p>


              <button
                  v-if="!getInscriptions()[compet.titre]?.[auth.authUser.username]"
                  @click="ouvrirPopupReservation(compet)"
              >
                Réserver
              </button>

              <button
                  v-else
                  @click="ouvrirPopupReservation(compet)"
              >
                Ma réservation
              </button>
            </div>
          </template>

          <div v-else>
            <div class="case vide"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="popupReservationOuvert" class="popup">
    <div class="popup-content">
      <h3>
        Réserver une place pour
        {{ popupReservationOuvert.titre }} — {{ popupReservationOuvert.jour }}
      </h3>

      <div class="inscriptiondiv" :class="{ vert: getNumero(popupReservationOuvert.titre) }">
        <template v-if="getInscriptions()[popupReservationOuvert.titre]?.[auth.authUser.username]">
          <p>Place réservée</p>
        </template>
        <template v-else>
         
          <button @click="reserver(popupReservationOuvert)">
            {{ isEnglish ? "Reserve my spot" : "Réserver ma place" }}
          </button>

        </template>
      </div>

      <div
          class="divCodeInscription"
          :class="{ visibility: numerosInscription[popupReservationOuvert.titre] }"
      >
        
        {{ isEnglish ? "✓ Reservation confirmed" : "✓ Réservation confirmée" }}
        <br>
        Numéro : {{ getNumero(popupReservationOuvert.titre) }}
        <br>
        <strong> {{ isEnglish ? "Do not share this number" : "Ne partagez pas ce numéro" }}</strong>
        

        <br><br>
        <button
            v-if="getInscriptions()[popupReservationOuvert.titre]?.[auth.authUser.username]"
            @click="desinscrire(popupReservationOuvert)"
        >
          {{ isEnglish ? "Cancel my reservation" : "Annuler ma réservation" }}
        </button>
      </div>

      <button @click="popupReservationOuvert = null">Fermer</button>
    </div>
  </div>

  <br><br><br>
</template>

<script setup>
import {
  getInscriptions,
  getNumero,
  inscrireUser,
  getCompetitionsMatin,
  getCompetitionsApresMidi,
  ajouterCompetition,
  desinscrireUser,
  supprimerCompetition,
  getPlacesRestantes
} from '@/services/localsource.service.js'

import { useAuth } from '@/stores/auth.js'
import { ref, onMounted } from 'vue'
import { useCompetitions } from '@/stores/competitions.js'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/languageStore.js'
import { computed } from 'vue'

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)

const popupReservationOuvert = ref(null)
const inscriptions = ref({})
const numerosInscription = ref({})

const competitions = useCompetitions()
const auth = useAuth()
const route = useRoute()

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

const ownerUsername = ref('')
const canEdit = ref(false)

onMounted(async () => {
  ownerUsername.value = route.params.ownerUsername
  canEdit.value = auth.authUser && auth.authUser.username === ownerUsername.value

  await competitions.getCompetitions()
  inscriptions.value = getInscriptions()
  Object.keys(inscriptions.value).forEach(titre => {
    numerosInscription.value[titre] = Object.values(inscriptions.value[titre])[0]
  })
})

function ouvrirPopupReservation(compet) {
  popupReservationOuvert.value = compet
}

async function reserver(compet) {
  if (getPlacesRestantes(compet) <= 0) return

  const numero = await inscrireUser(compet, auth.authUser)
  inscriptions.value = getInscriptions()
  numerosInscription.value[compet.titre] = numero
  await competitions.getCompetitions()
}

async function desinscrire(compet) {
  await desinscrireUser(compet, auth.authUser)
  inscriptions.value = getInscriptions()
  delete numerosInscription.value[compet.titre]
  await competitions.getCompetitions()
  popupReservationOuvert.value = null
}
</script>

<style>
* { font-family: 'Montserrat'; text-decoration: none; }

.titre { text-align: center; padding: 20px; }
.titre h1 { margin-bottom: 30px; font-size: 2em; color: #333; }

.planning {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 2000px;
  margin: 0 auto;
}

.jour {
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.jour h2 { text-align: center; color: #333; }
.periode h3 {
  margin-top: 10px;
  font-size: 1em;
  color: #555;
}

.cases {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.case {
  background: white;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.case.vide { background: #eaeaea; color: #aaa; }

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  max-width: 500px;
}

.inscriptiondiv {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin: 5px;
  border-radius: 8px;
  background-color: grey;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.inscriptiondiv.vert {
  background-color: #4CAF50;
}

.divCodeInscription{
  visibility: hidden;
  display: block;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  height: 400px
}
.divCodeInscription.visibility{
  visibility:visible;
}
</style>