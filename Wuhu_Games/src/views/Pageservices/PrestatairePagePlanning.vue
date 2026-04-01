
<template>
  <div class="titre">
    <h1>Planning</h1>
  </div>

  <div class="planning" v-if="hasPlanning">
    <div v-for="jour in jours" :key="jour" class="jour">
      <h2>{{ jour }}</h2>

      <div class="periode">
        <h3>Matin</h3>
        <div class="cases">
          <div v-for="compet in getMatin(jour)" :key="compet.id" class="case" @click="ouvrirParticipants(compet)">
            <p><strong>{{ compet.titre }}</strong></p>
            <p v-if="numeros[compet.id]" style="color:green;font-weight:bold;">Inscrit</p>
            <p>{{ compet.heure }}</p>
            <p>{{ compet.lieu }}</p>
            <button v-if="canEdit" @click.stop="supprimer(compet)">Supprimer</button>
          </div>
          <div v-if="getMatin(jour).length === 0" class="case vide"></div>
        </div>
      </div>

      <div class="periode">
        <h3>Après-midi</h3>
        <div class="cases">
          <div v-for="compet in getApresMidi(jour)" :key="compet.id" class="case" @click="ouvrirParticipants(compet)">
            <p><strong>{{ compet.titre }}</strong></p>
            <p v-if="numeros[compet.id]" style="color:green;font-weight:bold;">Inscrit</p>
            <p>{{ compet.heure }}</p>
            <p>{{ compet.lieu }}</p>
            <button v-if="canEdit" @click.stop="supprimer(compet)">Supprimer</button>
          </div>
          <div v-if="getApresMidi(jour).length === 0" class="case vide"></div>
        </div>
      </div>

    </div>
  </div>

  <div v-if="canEdit">
    <h2>Ajouter un créneau</h2>
    <div class="ajout-compet">
      <select v-model="newCompet.jour">
        <option disabled value="">Choisir un jour</option>
        <option v-for="jour in jours" :key="jour" :value="jour">{{ jour }}</option>
      </select>
      <input v-model="newCompet.titre" type="text" placeholder="Titre" />
      <input v-model="newCompet.heure" type="time" />
      <input v-model="newCompet.lieu" type="text" placeholder="Lieu" />
      <button @click="ajouterCompet">Ajouter</button>
    </div>
  </div>

  <div v-if="selectedCompet" class="popup">
    <div class="popup-content">
      <h3>Participants :</h3>
      <ul>
        <li v-for="joueur in selectedCompetJoueurs" :key="joueur.username">
          {{ joueur.username }}<span v-if="canEdit"> — Code : {{ joueur.numero }}</span>
        </li>
      </ul>
      <button v-if="auth.authUser && !canEdit" @click="ouvrirPopupInscription(selectedCompet)">
        {{ numeros[selectedCompet.id] ? 'Votre inscription' : "S'inscrire" }}
      </button>
      <button @click="selectedCompet = null">Fermer</button>
    </div>
  </div>

  <div v-if="popupInscriptionOuvert" class="popup">
    <div class="popup-content">
      <h3>S'inscrire à {{ popupInscriptionOuvert.titre }} du {{ popupInscriptionOuvert.jour }} ?</h3>
      <br>
      <div class="inscriptiondiv" :class="{ vert: numeros[popupInscriptionOuvert.id] }">
        <template v-if="numeros[popupInscriptionOuvert.id]">
          <p>Inscrit</p>
        </template>
        <template v-else>
          <button @click="inscrire(popupInscriptionOuvert)">M'inscrire</button>
        </template>
      </div>
      <div class="divCodeInscription" :class="{ visibility: numeros[popupInscriptionOuvert.id] }">
        Vous êtes inscrit.<br>
        Numéro d'inscription : {{ numeros[popupInscriptionOuvert.id] }}<br>
        Username : {{ auth.authUser.username }}<br>
        <h4 style="color:red">Ne partagez ce numéro à personne.</h4>
        <button @click="desinscrire(popupInscriptionOuvert)">Me désinscrire</button>
      </div>
      <button @click="popupInscriptionOuvert = null">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TemplateService from '@/services/template.service'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/stores/auth.js'
import PlanningPrestataireService from '@/services/planningPrestataire.service.js'
import api from '@/services/axios.service.js'

const auth = useAuth()
const route = useRoute()

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

const planning = ref([])
const newCompet = ref({ jour:'', titre:'', heure:'', lieu:'' })
const numeros = ref({})
const selectedCompet = ref(null)
const selectedCompetJoueurs = ref([])
const popupInscriptionOuvert = ref(null)

const paramKey = Object.keys(route.params)[0]
const owner = route.params[paramKey]

const canEdit = ref(false)
const hasPlanning = ref(false)

onMounted(async () => {
  canEdit.value = auth.authUser && auth.authUser.username === owner

  const all = await TemplateService.getTemplates()
  const template = all.data.find(t => t.username === owner)
  console.log("OWNER:", owner)
  console.log("TEMPLATE:", template)
  console.log("PLANNING:", template?.planning)
  if (template?.services?.includes('planning')) {
    hasPlanning.value = true
    planning.value = typeof template.planning === 'string'
    ? JSON.parse(template.planning)
    : (template.planning || [])
  }

  if (auth.authUser && !canEdit.value) {
    for (const compet of planning.value) {
      const numero = await PlanningPrestataireService.getNumero(owner, compet.id, auth.authUser.username)
      if (numero) numeros.value[compet.id] = numero
    }
  }
})

function getMatin(jour) {
  return planning.value.filter(c => parseInt(c.heure.split(':')[0]) < 12 && c.jour === jour)
}

function getApresMidi(jour) {
  return planning.value.filter(c => parseInt(c.heure.split(':')[0]) >= 12 && c.jour === jour)
}

async function ouvrirParticipants(compet) {
  selectedCompet.value = compet
  const res = await api.get(`/planning-prestataire/${owner}/${compet.id}`)
  selectedCompetJoueurs.value = res.data.data || []
}

function ouvrirPopupInscription(compet) {
  selectedCompet.value = null
  popupInscriptionOuvert.value = compet
}

async function ajouterCompet() {
  if (!canEdit.value) return
  planning.value.push({ id: uuidv4(), ...newCompet.value, joueurs: [] })
  await TemplateService.updateTemplate(owner, { planning: planning.value })
  newCompet.value = { jour:'', titre:'', heure:'', lieu:'' }
}

async function supprimer(compet) {
  if (!canEdit.value) return
  planning.value = planning.value.filter(c => c.id !== compet.id)
  await TemplateService.updateTemplate(owner, { planning: planning.value })
}

async function inscrire(compet) {
  const numero = await PlanningPrestataireService.inscrireUser(owner, compet.id, auth.authUser.username)
  if (numero) numeros.value[compet.id] = numero
}

async function desinscrire(compet) {
  await PlanningPrestataireService.desinscrireUser(owner, compet.id, auth.authUser.username)
  delete numeros.value[compet.id]
  popupInscriptionOuvert.value = null
}
</script>

<style scoped>
.titre { text-align:center; padding:20px; }
.planning { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; max-width:2000px; margin:0 auto; }
.jour { background:#f7f7f7; border-radius:10px; padding:10px; box-shadow:0 3px 6px rgba(0,0,0,0.1); }
.case { background:white; border-radius:8px; padding:8px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.1); min-height:70px; display:flex; flex-direction:column; justify-content:center; cursor:pointer; }
.case.vide { background:#eaeaea; }
.popup { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; }
.popup-content { background:white; padding:20px; border-radius:10px; min-width:300px; max-width:500px; }
.inscriptiondiv { display:flex; justify-content:center; align-items:center; padding:5px; margin:5px; border-radius:8px; background-color:grey; width:fit-content; margin-left:auto; margin-right:auto; }
.inscriptiondiv.vert { background-color:#4CAF50; }
.divCodeInscription { visibility:hidden; display:block; padding:10px; margin:5px; border-radius:8px; width:fit-content; margin-left:auto; margin-right:auto; height:400px; }
.divCodeInscription.visibility { visibility:visible; }
</style>
