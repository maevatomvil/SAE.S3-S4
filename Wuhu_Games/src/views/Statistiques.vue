<template>
  <div class="stats">
    <h1>Statistiques de vos services</h1>

    <div v-if="prestataire?.services?.includes('achat')" class="card">
      <h2>Service E-commerce</h2>
      <p>Prix d'un panier moyen : {{ panierMoyen.toFixed(2) }} €</p>
      <br>
      <p>Classement des articles les plus vendus :</p>
      <ul>
        <li v-for="a in classement" :key="a.titre">
          {{ a.titre }} — {{ a.quantite }} ventes
        </li>
      </ul>
    </div>

    <div v-if="prestataire?.services?.includes('info')" class="card">
      <h2>Service Page d'information</h2>
      <p>Evolution du nombre de consultation de la page par rapport au temps</p>
      <canvas id="chartVues"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TemplateService from '@/services/template.service.js'
import StatistiquesService from '@/services/statistiques.service.js'
import Chart from 'chart.js/auto'

const route = useRoute()
const username = route.params.username

const prestataire = ref(null)
const panierMoyen = ref(0)
const classement = ref([])
const vues = ref([])

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  prestataire.value = res.data.find(p => p.username === username)

  if (prestataire.value?.services?.includes('achat')) {
    panierMoyen.value = StatistiquesService.getPanierMoyen()
    classement.value = StatistiquesService.getClassementArticles()
  }

  if (prestataire.value?.services?.includes('info')) {
    vues.value = StatistiquesService.getVuesPageInfo(username)

    await nextTick()

    const ctx = document.getElementById('chartVues')
    if (!ctx) return

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: vues.value.map(v => v.date),
        datasets: [{
          label: 'Vues',
          data: vues.value.map(v => v.count),
          borderColor: 'blue'
        }]
      }
    })
  }
})
</script>

<style scoped>
.stats {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.card {
  background: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  width: 100%;
  max-width: 700px;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 5px 0;
}
</style>
