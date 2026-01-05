<template>
  <div class="titre">
    <h1>Créer votre planning</h1>
  </div>

  <div class="planning">
    <div v-for="jour in jours" :key="jour" class="jour">
      <h2>{{ jour }}</h2>

      <div class="periode">
        <h3>Matin</h3>
        <div class="cases">
          <div v-for="compet in getMatin(jour)" :key="compet.id" class="case">
            <p><strong>{{ compet.titre }}</strong></p>
            <p>{{ compet.heure }}</p>
            <p>{{ compet.lieu }}</p>
            <button @click="supprimer(compet)">Supprimer</button>
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
            <button @click="supprimer(compet)">Supprimer</button>
          </div>
          <div v-if="getApresMidi(jour).length === 0" class="case vide"></div>
        </div>
      </div>
    </div>
  </div>

 

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

  <button class="btn-save" @click="valider">Valider</button>
  <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
  <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TemplateService from '@/services/template.service'
import { v4 as uuidv4 } from 'uuid'

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

const planning = ref([])
const newCompet = ref({ jour:'', titre:'', heure:'', lieu:'' })
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  const template = await TemplateService.getCurrentTemplate()
  planning.value = template.planning || []
})

function getMatin(jour) {
  return planning.value.filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) < 12)
}

function getApresMidi(jour) {
  return planning.value.filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) >= 12)
}

function ajouterCompet() {
  if (!newCompet.value.jour || !newCompet.value.titre || !newCompet.value.heure || !newCompet.value.lieu) return
  planning.value.push({ id: uuidv4(), ...newCompet.value, joueurs: [] })
  TemplateService.saveCurrentTemplate({ planning: planning.value })
  newCompet.value = { jour:'', titre:'', heure:'', lieu:'' }
}

function supprimer(compet) {
  planning.value = planning.value.filter(c => c.id !== compet.id)
  TemplateService.saveCurrentTemplate({ planning: planning.value })
}

function valider() {
  TemplateService.saveCurrentTemplate({ planning: planning.value })
  successMessage.value = 'Planning sauvegardé !'
  errorMessage.value = ''
  setTimeout(() => {
    history.back()
  }, 500)
}
</script>

<style scoped>
.titre { text-align:center; padding:20px; }
.planning { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; max-width:2000px; margin:0 auto; }
.jour { background:#f7f7f7; border-radius:10px; padding:10px; box-shadow:0 3px 6px rgba(0,0,0,0.1); }
.case { background:white; border-radius:8px; padding:8px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.1); min-height:70px; display:flex; flex-direction:column; justify-content:center; }
.case.vide { background:#eaeaea; }
.btn-save { margin-top:20px; padding:10px 20px; background:#0000f5; color:white; border:none; border-radius:6px; cursor:pointer; }
</style>
