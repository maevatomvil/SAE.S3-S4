<template>
  
  <div class="titre">
    <h1>Planning des compétitions</h1>
  </div>
  <div v-if="!auth.authUser" >
    <p>Connectez vous pour voir le planning</p>
  </div>


  <div class="planning" v-if="competitions.compUser">
    <div v-for="jour in jours" :key="jour" class="jour">
      <h2>{{ jour }}</h2>

      <div class="periode">
        <h3>Matin</h3>
        <div class="cases">
          <template v-if="getCompetitionsMatin(competitions.compUser, jour).length">
            <div v-for="compet in getCompetitionsMatin(competitions.compUser, jour)" :key="compet.titre" class="case" @click="ouvrirParticipants(compet)">
              <p><strong>{{ compet.titre }}</strong></p>
              <p v-if="getInscriptions()[compet.titre]?.[auth.authUser.username]" style="color:green; font-weight:bold;">Inscrit</p>
              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>
               <button v-if="auth.authUser && auth.authUser.role === 'organisateur'" @click="supprimer(compet)">
                  Supprimer
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
            <div v-for="compet in getCompetitionsApresMidi(competitions.compUser, jour)" :key="compet.titre" class="case" @click="ouvrirParticipants(compet)">
              <p><strong>{{ compet.titre }}</strong></p>
              <p v-if="inscriptions[compet.titre]?.[auth.authUser.username]" style="color:green; font-weight:bold;">Inscrit</p>
              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>
              <button v-if="auth.authUser && auth.authUser.role === 'organisateur'" @click="supprimer(compet)">
                  Supprimer
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

  <div v-if="auth.authUser && auth.authUser.role === 'organisateur'">
    <h2>Ajouter une compétition</h2>

    <div class="ajout-compet">
      <select v-model="newCompet.jour">
        <option disabled value="">Choisir un jour</option>
        <option v-for="jour in jours" :key="jour" :value="jour">{{ jour }}</option>
      </select>

      <input v-model="newCompet.titre" type="text" placeholder="Titre de la compétition" />
      <input v-model="newCompet.heure" type="time" />
      <input v-model="newCompet.lieu" type="text" placeholder="Lieu" />

      <button @click="ajouterCompet">Ajouter</button>
    </div>
  </div>

  <div v-if="selectedCompet" class="popup">
    <div class="popup-content">
      <h3>Participants: </h3>
      <ul>
        <li v-for="joueur in selectedCompet.joueurs || []" :key="joueur.username">
          {{ joueur.firstname }} {{ joueur.surname }} ({{ joueur.username }})
        </li>
      </ul>
      <button 
        v-if="!getInscriptions()[selectedCompet.titre]?.[auth.authUser.username]" 
          @click="ouvrirPopupInscription(selectedCompet)">
        S'inscrire
      </button>
      <button v-else @click="ouvrirPopupInscription(selectedCompet)">
        votre inscription
      </button>
      <button @click="selectedCompet = null">Fermer</button>
    </div>
  </div>

  <div v-if="popupInscriptionOuvert" class="popup">
    <div class="popup-content">
      <h3>S'inscrire dans la compétition de {{ popupInscriptionOuvert.titre }} du {{ popupInscriptionOuvert.jour }} ? </h3>
      <br></br>
       <div class="inscriptiondiv" ::class="{ vert: getNumero(popupInscriptionOuvert.titre) }">
        <template v-if="getInscriptions()[popupInscriptionOuvert.titre]?.[auth.authUser.username]">
          <p>Inscrit</p>
        </template>
        <template v-else>
          <button @click="inscrire(popupInscriptionOuvert)">M'inscrire</button>
        </template>
      </div>
      <div class="divCodeInscription" :class="{ visibility: numerosInscription[popupInscriptionOuvert.titre] }">
          Vous êtes inscrit à la compétition. 
          <br></br>Numéro d'inscription : {{ getNumero(popupInscriptionOuvert.titre) }}
          <br></br>Username : {{auth.authUser.username}}
          <br></br>
          <h4 style="color:red"> ne partagez ce numéro à personne, il vous sera demandé avec votre username sur place.</h4>
          <button v-if="getInscriptions()[popupInscriptionOuvert.titre]?.[auth.authUser.username]" @click="desinscrire(popupInscriptionOuvert)">
             Me désinscrire
        </button>
      </div>

      <button @click="popupInscriptionOuvert = null">Fermer</button>
    </div>
  </div>

  <br><br><br>
</template>

<script setup>
import { getInscriptions, getNumero, inscrireUser ,getCompetitionsMatin, getCompetitionsApresMidi, ajouterCompetition } from '@/services/localsource.service.js'
import { useAuth } from '@/stores/auth.js'
import { ref, onMounted } from 'vue'
import { useCompetitions } from '@/stores/competitions.js'
import { desinscrireUser } from '@/services/localsource.service.js'
import { supprimerCompetition } from '@/services/localsource.service.js'


const inscriptions = ref({})
const numerosInscription = ref({})

const competitions = useCompetitions()
const auth = useAuth()
const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const selectedCompet = ref(null)

onMounted(async () => {
  await competitions.getCompetitions()
  inscriptions.value = getInscriptions()
  Object.keys(inscriptions.value).forEach(titre => {
    numerosInscription.value[titre] = Object.values(inscriptions.value[titre])[0]
  })
})

const newCompet = ref({
  jour: '',
  titre: '',
  heure: '',
  lieu: ''
})

async function ajouterCompet() {
    ajouterCompetition(newCompet.value, competitions.compUser)
    await competitions.getCompetitions()
    newCompet.value.jour = ''
    newCompet.value.titre = ''
    newCompet.value.heure = ''
    newCompet.value.lieu = ''
}

const popupInscriptionOuvert = ref(null)

function ouvrirParticipants(compet) {
  selectedCompet.value = compet;
 
}

function ouvrirPopupInscription(compet) {
  selectedCompet.value = null 
  popupInscriptionOuvert.value = compet
}



async function inscrire(compet) {
  const numero = await inscrireUser(compet, auth.authUser)
  inscriptions.value = getInscriptions()
  numerosInscription.value[compet.titre] = numero
  await competitions.getCompetitions()

  // Trouver la compétition dans le store
  const index = competitions.compUser.findIndex(c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure)
  if (index !== -1) {
    const comp = competitions.compUser[index]

    // Ajouter l'utilisateur s'il n'existe pas déjà
    if (!comp.joueurs.find(j => j.username === auth.authUser.username)) {
      comp.joueurs.push({
        username: auth.authUser.username,
        firstname: auth.authUser.firstname,
        surname: auth.authUser.surname
      })
    }

    // Mettre à jour le popup
    selectedCompet.value = { ...comp } 
  }
}




async function desinscrire(compet) {
  await desinscrireUser(compet, auth.authUser)
  inscriptions.value = getInscriptions()
  delete numerosInscription.value[compet.titre]
  await competitions.getCompetitions()
  const index = competitions.compUser.findIndex(
    c => c.titre === compet.titre && c.jour === compet.jour && c.heure === compet.heure
  )
  if (index !== -1) {
    selectedCompet.value = { ...competitions.compUser[index] }
  }

  popupInscriptionOuvert.value = null
}





async function supprimer(compet) {
  if (!confirm(` supprimer la compétition "${compet.titre}" ?`)) return

  await supprimerCompetition(compet)  
  await competitions.getCompetitions() 

  if (selectedCompet.value && selectedCompet.value.titre === compet.titre) {
    selectedCompet.value = null
  }
  if (popupInscriptionOuvert.value && popupInscriptionOuvert.value.titre === compet.titre) {
    popupInscriptionOuvert.value = null
  }
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
    color: #555; }

.cases { 
    display: flex;
    flex-direction: column;
    gap: 5px; }

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
