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
  <br><br><br>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCompetitions } from '@/services/services.js'

const competitions = ref([])

onMounted(async () => {
  competitions.value = await getCompetitions()
})

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

function matin(jour) {
  return competitions.value.filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) < 12)
}

function apresMidi(jour) {
  return competitions.value.filter(c => c.jour === jour && parseInt(c.heure.split(':')[0]) >= 12)
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
