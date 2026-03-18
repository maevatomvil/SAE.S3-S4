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

    <div v-if="prestataire?.services?.includes('livre-dor')" class="card">
      <h2>Service de livre d'or</h2>
      <p>Nombre de messages reçus par jour</p>
      <canvas id="chartLivreDor"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TemplateService from '@/services/template.service.js'
import StatistiquesService from '@/services/statistiques.service.js'
import Chart from 'chart.js/auto'
import { useAuth } from '@/stores/auth.js'
const auth = useAuth()

const route = useRoute()
const username = route.params.username

const prestataire = ref(null)
const panierMoyen = ref(0)
const classement = ref([])
const vues = ref([])
const messagesParJour = ref([])
onMounted(async () => {
  if (!auth.authUser || auth.authUser.username !== username) {
    window.location.href = '/'
    return
  }

  const res = await TemplateService.getTemplates()
  prestataire.value = res.data.find(p => p.username === username)
  
  if (prestataire.value?.services?.includes('achat')) {
    panierMoyen.value = await StatistiquesService.getPanierMoyen(prestataire.value.username)
    classement.value = await StatistiquesService.getClassementArticles(prestataire.value)
  }

  if (prestataire.value?.services?.includes('info')) {
    vues.value = await StatistiquesService.getVuesPageInfo(username)

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
      },
      options: {
        scales: {
          y: {
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    })
  }


  if (prestataire.value?.services?.includes('livre-dor')) {
    const res = await StatistiquesService.getLivreDorStats(username)
    messagesParJour.value = res.data || []
    await nextTick()
    const ctx = document.getElementById('chartLivreDor')
    if (!ctx) return
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: messagesParJour.value.map(v => v.date),
        datasets: [{
          label: 'Messages',
          data: messagesParJour.value.map(v => v.count),
          backgroundColor: '#5858d8'
        }]
      },
      options: {
        scales: {
          y: {
            ticks: { stepSize: 1, precision: 0 }
          }
        }
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
