<template>
  <div class="titre">
    <h1>
      <span v-if="!isEnglish">Planning des compétitions</span>
      <span v-else>Competition schedule</span>
    </h1>
  </div>

  <div v-if="!auth.authUser">
    <p>
      <span v-if="!isEnglish">Connectez-vous pour voir le planning</span>
      <span v-else>Log in to view the schedule</span>
    </p>
  </div>

  <div class="planning" v-if="competitions.compUser">
    <div v-for="jour in jours" :key="jour" class="jour">
      <h2>
        <span v-if="!isEnglish">{{ jour }}</span>
        <span v-else>{{ joursEN[jours.indexOf(jour)] }}</span>
      </h2>

      <div class="periode">
        <h3>
          <span v-if="!isEnglish">Matin</span>
          <span v-else>Morning</span>
        </h3>

        <div class="cases">
          <template v-if="getCompetitionsMatin(competitions.compUser, jour).length">
            <div
              v-for="compet in getCompetitionsMatin(competitions.compUser, jour)"
              :key="compet.titre"
              class="case"
              @click="ouvrirParticipants(compet)"
            >
              <p><strong>{{ compet.titre }}</strong></p>

              <p
                v-if="numerosInscription[compet.titre]"
                style="color:green;font-weight:bold;"
              >

                <span v-if="!isEnglish">Inscrit</span>
                <span v-else>Registered</span>
              </p>

              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>

              <button v-if="canEdit" @click.stop="supprimer(compet)">
                <span v-if="!isEnglish">Supprimer</span>
                <span v-else>Delete</span>
              </button>
            </div>
          </template>

          <div v-else>
            <div class="case vide"></div>
          </div>
        </div>
      </div>

      <div class="periode">
        <h3>
          <span v-if="!isEnglish">Après-midi</span>
          <span v-else>Afternoon</span>
        </h3>

        <div class="cases">
          <template v-if="getCompetitionsApresMidi(competitions.compUser, jour).length">
            <div
              v-for="compet in getCompetitionsApresMidi(competitions.compUser, jour)"
              :key="compet.titre"
              class="case"
              @click="ouvrirParticipants(compet)"
            >
              <p><strong>{{ compet.titre }}</strong></p>

              <p
                v-if="numerosInscription[compet.titre]"

                style="color:green;font-weight:bold;"
              >
                <span v-if="!isEnglish">Inscrit</span>
                <span v-else>Registered</span>
              </p>

              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>

              <button v-if="canEdit" @click.stop="supprimer(compet)">
                <span v-if="!isEnglish">Supprimer</span>
                <span v-else>Delete</span>
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

  <div v-if="canEdit">
    <h2>
      <span v-if="!isEnglish">Ajouter une compétition</span>
      <span v-else>Add a competition</span>
    </h2>

    <div class="ajout-compet">
      <select v-model="newCompet.jour">
        <option disabled value="">
          <span v-if="!isEnglish">Choisir un jour</span>
          <span v-else>Select a day</span>
        </option>

        <option v-for="jour in jours" :key="jour" :value="jour">
          <span v-if="!isEnglish">{{ jour }}</span>
          <span v-else>{{ joursEN[jours.indexOf(jour)] }}</span>
        </option>
      </select>

      <input
        v-model="newCompet.titre"
        type="text"
        :placeholder="isEnglish ? 'Competition title' : 'Titre de la compétition'"
      />

      <input v-model="newCompet.heure" type="time" />

      <input
        v-model="newCompet.lieu"
        type="text"
        :placeholder="isEnglish ? 'Location' : 'Lieu'"
      />

      <button @click="ajouterCompet">
        <span v-if="!isEnglish">Ajouter</span>
        <span v-else>Add</span>
      </button>
    </div>
  </div>

  <div v-if="selectedCompet" class="popup">
    <div class="popup-content">
      <h3>
        <span v-if="!isEnglish">Participants :</span>
        <span v-else>Participants:</span>
      </h3>

      <ul>
        <li v-for="joueur in selectedCompet.joueurs || []" :key="joueur.username">
          {{ joueur.firstname }} {{ joueur.surname }} ({{ joueur.username }})
          <span v-if="canEdit"> — Code : {{ inscriptions[selectedCompet.titre]?.[joueur.username] }} </span>
        </li>
      </ul>

      <button
        v-if="!numerosInscription[selectedCompet.titre]"

        @click="ouvrirPopupInscription(selectedCompet)"
      >
        <span v-if="!isEnglish">S'inscrire</span>
        <span v-else>Register</span>
      </button>

      <button
        v-else
        @click="ouvrirPopupInscription(selectedCompet)"
      >
        <span v-if="!isEnglish">Votre inscription</span>
        <span v-else>Your registration</span>
      </button>

      <button @click="selectedCompet = null">
        <span v-if="!isEnglish">Fermer</span>
        <span v-else>Close</span>
      </button>
    </div>
  </div>

  <div v-if="popupInscriptionOuvert" class="popup">
    <div class="popup-content">
      <h3>
        <span v-if="!isEnglish">
          S'inscrire dans la compétition de {{ popupInscriptionOuvert.titre }} du {{ popupInscriptionOuvert.jour }} ?
        </span>
        <span v-else>
          Register for the {{ popupInscriptionOuvert.titre }} competition on {{ joursEN[jours.indexOf(popupInscriptionOuvert.jour)] }}?
        </span>
      </h3>

      <br>

      <div class="inscriptiondiv" :class="{ vert: numerosInscription[popupInscriptionOuvert.titre] }">
        <template v-if="numerosInscription[popupInscriptionOuvert.titre]">

          <p>
            <span v-if="!isEnglish">Inscrit</span>
            <span v-else>Registered</span>
          </p>
        </template>

        <template v-else>
          <button @click="inscrire(popupInscriptionOuvert)">
            <span v-if="!isEnglish">M'inscrire</span>
            <span v-else>Register me</span>
          </button>
        </template>
      </div>

      <div class="divCodeInscription" :class="{ visibility: numerosInscription[popupInscriptionOuvert.titre] }">
        <span v-if="!isEnglish">
          Vous êtes inscrit à la compétition.
          <br>Numéro d'inscription : {{ numerosInscription[popupInscriptionOuvert.titre] }}
          <br>Username : {{auth.authUser.username}}
          <br><h4 style="color:red">Ne partagez ce numéro à personne.</h4>
        </span>

        <span v-else>
          You are registered for the competition.
          <br>Registration number: {{ numerosInscription[popupInscriptionOuvert.titre] }}
          <br>Username: {{auth.authUser.username}}
          <br><h4 style="color:red">Do not share this number with anyone.</h4>
        </span>

        <button
          v-if="numerosInscription[popupInscriptionOuvert.titre]"

          @click="desinscrire(popupInscriptionOuvert)"
        >
          <span v-if="!isEnglish">Me désinscrire</span>
          <span v-else>Unregister</span>
        </button>
      </div>

      <button @click="popupInscriptionOuvert = null">
        <span v-if="!isEnglish">Fermer</span>
        <span v-else>Close</span>
      </button>
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
  syncNumeroWithBackend

} from '@/services/localsource.service.js'

import { useAuth } from '@/stores/auth.js'
import { ref, onMounted, computed } from 'vue'
import { useCompetitions } from '@/stores/competitions.js'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/languageStore.js'

const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)

const inscriptions = ref({})
const numerosInscription = ref({})

const competitions = useCompetitions()
const auth = useAuth()
const route = useRoute()
const popupInscriptionOuvert = ref(null)

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
const joursEN = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

const selectedCompet = ref(null)

const ownerUsername = ref('')
const canEdit = ref(false)

onMounted(async () => {

  canEdit.value = auth.authUser && auth.authUser.role === 'organisateur'

  await competitions.getCompetitions()
  inscriptions.value = await getInscriptions()
  const current = auth.authUser?.username

  Object.keys(inscriptions.value).forEach(titre => {
    const users = inscriptions.value[titre]
    if (current && users[current]) {
      numerosInscription.value[titre] = users[current]
    }
  })

  for (const compet of competitions.compUser || []) {
    const numero = await syncNumeroWithBackend(compet, current)
    if (numero) {
      numerosInscription.value[compet.titre] = numero
    }
  }

})


const newCompet = ref({
  jour: '',
  titre: '',
  heure: '',
  lieu: ''
})

async function ajouterCompet() {
  if (!canEdit.value) return
  ajouterCompetition(newCompet.value, competitions.compUser)
  await competitions.getCompetitions()
  newCompet.value = { jour:'', titre:'', heure:'', lieu:'' }
}

function ouvrirParticipants(compet) {
  selectedCompet.value = compet
}

function ouvrirPopupInscription(compet) {
  selectedCompet.value = null
  popupInscriptionOuvert.value = compet
}

async function inscrire(compet) {
  const numero = await inscrireUser(compet, auth.authUser)
  inscriptions.value = await getInscriptions()
  numerosInscription.value[compet.titre] = numero
  await competitions.getCompetitions()
}

async function desinscrire(compet) {
  await desinscrireUser(compet, auth.authUser)
  inscriptions.value = await getInscriptions()
  delete numerosInscription.value[compet.titre]
  await competitions.getCompetitions()
}

async function supprimer(compet) {
  if (!canEdit.value) return
  await supprimerCompetition(compet)
  await competitions.getCompetitions()
  if (selectedCompet.value && selectedCompet.value.titre === compet.titre) selectedCompet.value = null
  if (popupInscriptionOuvert.value && popupInscriptionOuvert.value.titre === compet.titre) popupInscriptionOuvert.value = null
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
