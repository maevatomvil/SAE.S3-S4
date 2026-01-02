<template>
  <div class="titre">
    <h1>Planning</h1>
  </div>

  <div class="planning" v-if="planning.length">
    <div v-for="jour in jours" :key="jour" class="jour">
      <h2>{{ jour }}</h2>

      <div class="periode">
        <h3>Matin</h3>
        <div class="cases">
          <div v-for="compet in getMatin(jour)" :key="compet.id" class="case">
            <p><strong>{{ compet.titre }}</strong></p>
            <p>{{ compet.heure }}</p>
            <p>{{ compet.lieu }}</p>
            <button v-if="canEdit" @click="supprimer(compet)">Supprimer</button>
          </div>
          <div v-if="getMatin(jour).length === 0" class="case vide"></div>
        </div>
      </div>

      <div class="periode">
        <h3>Après-midi</h3>
        <div class="cases">
          <div v-for="compet in getApresMidi(jour)" :key="compet.id" class="case">
            <p><strong>{{ compet.titre }}</strong></p>
            <p>{{ compet.heure }}</p>
            <p>{{ compet.lieu }}</p>
            <button v-if="canEdit" @click="supprimer(compet)">Supprimer</button>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TemplateService from '@/services/template.service'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/stores/auth.js'

const auth = useAuth()
const route = useRoute()

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

const planning = ref([])
const newCompet = ref({ jour:'', titre:'', heure:'', lieu:'' })

const paramKey = Object.keys(route.params)[0]
const owner = route.params[paramKey]

const canEdit = ref(false)

onMounted(async () => {
  canEdit.value = auth.authUser && auth.authUser.username === owner

  const all = await TemplateService.getTemplates()
  const template = all.data.find(t =>
    t.username === owner &&
    t.services &&
    t.services.includes('planning')
  )

  planning.value = template?.planning || []
})

function getMatin(jour) {
  return planning.value.filter(c => parseInt(c.heure.split(':')[0]) < 12 && c.jour === jour)
}

function getApresMidi(jour) {
  return planning.value.filter(c => parseInt(c.heure.split(':')[0]) >= 12 && c.jour === jour)
}

function ajouterCompet() {
  if (!canEdit.value) return
  planning.value.push({ id: uuidv4(), ...newCompet.value, joueurs: [] })

  const all = JSON.parse(localStorage.getItem('templates') || '[]')
  const index = all.findIndex(t =>
    t.username === owner &&
    t.services &&
    t.services.includes('planning')
  )
  if (index !== -1) {
    all[index].planning = planning.value
    localStorage.setItem('templates', JSON.stringify(all))
  }

  newCompet.value = { jour:'', titre:'', heure:'', lieu:'' }
}

function supprimer(compet) {
  if (!canEdit.value) return
  planning.value = planning.value.filter(c => c.id !== compet.id)

  const all = JSON.parse(localStorage.getItem('templates') || '[]')
  const index = all.findIndex(t =>
    t.username === owner &&
    t.services &&
    t.services.includes('planning')
  )
  if (index !== -1) {
    all[index].planning = planning.value
    localStorage.setItem('templates', JSON.stringify(all))
  }
}
</script>

<style scoped>
.titre { text-align:center; padding:20px; }
.planning { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; max-width:2000px; margin:0 auto; }
.jour { background:#f7f7f7; border-radius:10px; padding:10px; box-shadow:0 3px 6px rgba(0,0,0,0.1); }
.case { background:white; border-radius:8px; padding:8px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.1); min-height:70px; display:flex; flex-direction:column; justify-content:center; }
.case.vide { background:#eaeaea; }
</style>
