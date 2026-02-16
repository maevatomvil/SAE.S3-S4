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

              <button
                  v-if="!numerosInscription[compet.titre]"
                  @click="ouvrirPopupReservation(compet)"
              >
                Réserver
              </button>

              <button
                  v-else-if="numerosInscription[compet.titre]"
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
                v-if="numerosInscription[compet.titre]"
                style="color:green;font-weight:bold;"
              >
                Réservé
              </p>

              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>

              <button
                  v-if="!numerosInscription[compet.titre]"
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
      <div v-if="auth.authUser?.role === 'organisateur'">
        <h4>Liste des spectateurs inscrits :</h4>

        <div v-if="!popupReservationOuvert.spectateurs || Object.keys(popupReservationOuvert.spectateurs).length === 0">
          Aucun spectateur inscrit pour cette compétition.
        </div>

        <ul v-else>
        <li
          v-for="s in popupReservationOuvert.spectateurs"
          :key="s.username"
        >
          {{ s.username }} — Numéro : {{ s.numero }}
        </li>
      </ul>


        <hr>
      </div>

      <div class="inscriptiondiv" :class="{ vert: numerosInscription[popupReservationOuvert.titre] }">
        <template v-if="numerosInscription[popupReservationOuvert.titre]">

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
        Numéro : {{ numerosInscription[popupReservationOuvert.titre] }}

        <br>
        <strong> {{ isEnglish ? "Do not share this number" : "Ne partagez pas ce numéro" }}</strong>
        

        <br><br>
        <button
           v-if="numerosInscription[popupReservationOuvert.titre]"

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
  getCompetitionsMatin,
  getCompetitionsApresMidi,
  inscrireSpectateur,
  desinscrireSpectateur,
  syncNumeroSpectateurWithBackend
} from '@/services/localsource.service.js'

import { useAuth } from '@/stores/auth.js'
import { ref, onMounted, computed, nextTick } from 'vue'
import { useCompetitions } from '@/stores/competitions.js'
import { useSpectateurs } from '@/stores/spectateurs.store.js'
import { useLanguageStore } from '@/stores/languageStore.js'

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)

const inscriptions = ref({})
const numerosInscription = ref({})

const competitions = useCompetitions()
const spectateursStore = useSpectateurs()
const auth = useAuth()

const popupReservationOuvert = ref(null)

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

onMounted(async () => {
  await competitions.getCompetitions()
  await spectateursStore.getSpectateurs()

  inscriptions.value = JSON.parse(localStorage.getItem('spectateurs')) || {}

  const current = auth.authUser?.username

  Object.keys(inscriptions.value).forEach(titre => {
    const users = inscriptions.value[titre]
    if (current && users[current]) {
      numerosInscription.value[titre] = users[current]
    }
  })

  await nextTick()

  for (const compet of competitions.compUser) {
    const numero = await syncNumeroSpectateurWithBackend(compet, current)
    if (numero !== null && numero !== undefined) {
      numerosInscription.value[compet.titre] = numero
      inscriptions.value[compet.titre] = inscriptions.value[compet.titre] || {}
      inscriptions.value[compet.titre][current] = numero
    }
  }
})
function ouvrirPopupReservation(compet) {
  const spectateurs = spectateursStore.spectateursUser.find(
    c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.jour
  )

  popupReservationOuvert.value = {
    ...compet,
    spectateurs: spectateurs?.spectateurs || []
  }
}


async function reserver(compet) {
  const numero = await inscrireSpectateur(compet, auth.authUser)
  inscriptions.value = JSON.parse(localStorage.getItem('spectateurs')) || {}
  numerosInscription.value[compet.titre] = numero
  await competitions.getCompetitions()
  await spectateursStore.getSpectateurs()
}

async function desinscrire(compet) {
  await desinscrireSpectateur(compet, auth.authUser)
  inscriptions.value = JSON.parse(localStorage.getItem('spectateurs')) || {}
  delete numerosInscription.value[compet.titre]
  await competitions.getCompetitions()
  await spectateursStore.getSpectateurs()
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
