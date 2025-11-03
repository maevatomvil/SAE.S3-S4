<template>
  <div class="titre">
    <h1>Planning des compétitions</h1>
  </div>

  <div class="planning">
    <div v-for="jour in jours" :key="jour" class="jour">
      <h2>{{ jour }}</h2>

      <div class="periode">
        <h3>Matin</h3>
        <div class="cases">
          <template v-if="matin(jour).length >= 1">
            <div v-for="compet in matin(jour)" :key="compet.titre" class="case">
              <p><strong>{{ compet.titre }}</strong></p>
              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>
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
          <template v-if="apresMidi(jour).length >= 1">
            <div v-for="compet in apresMidi(jour)" :key="compet.titre" class="case">
              <p><strong>{{ compet.titre }}</strong></p>
              <p>{{ compet.heure }}</p>
              <p>{{ compet.lieu }}</p>
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

  

  <br><br><br>
</template>

<script setup>
import { useAuth } from '@/stores/auth.js'
import { ref, onMounted } from 'vue'
import { useCompetitions } from '@/stores/competitions.js'

const competitions = useCompetitions()
const auth = useAuth()
onMounted(async () => {
  await competitions.getCompetitions()
})

ref({
  jour: '',
  heure: '',
  titre: '',
  lieu: ''
})

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const newCompet = ref({
  titre: '',
  heure: '',
  lieu: ''
})

function ajouterCompet() {
  if (!newCompet.value.titre || !newCompet.value.heure || !newCompet.value.lieu || !newCompet.value.jour){
    return;
  } else {
    competitions.compUser.push({
      ...newCompet.value
    })
    newCompet.value.jour = ''
    newCompet.value.titre = ''
    newCompet.value.heure = ''
    newCompet.value.lieu = ''
  }
}

function matin(jour) {
  if (!competitions.compUser || !Array.isArray(competitions.compUser)) return []
  return competitions.compUser
    .filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) < 12)
    .sort((a, b) => a.heure.localeCompare(b.heure))
}

function apresMidi(jour) {
  if (!competitions.compUser || !Array.isArray(competitions.compUser)) return []
  return competitions.compUser
    .filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) >= 12)
    .sort((a, b) => a.heure.localeCompare(b.heure))
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
</style>
