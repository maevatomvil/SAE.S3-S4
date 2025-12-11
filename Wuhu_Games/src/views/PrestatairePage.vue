<template>
  <div v-if="prestataire">
    <div class="titre">
      <h1>{{ prestataire.name || 'Prestataire inconnu' }}</h1>
    </div>

    <div class="presentation">
      <p>{{ prestataire.shortDescription }}</p>
      <img :src="prestataire.image || '/public/default.jpg'" :alt="`Image de ${prestataire.name}`" />
    </div>

    <div class="presentation_services" v-if="prestataire.services?.length">
      <h3>Nos services :</h3>
      <ul>
        <li v-for="serviceId in prestataire.services" :key="serviceId">
          {{ serviceName(serviceId) }}
        </li>
      </ul>
    </div>
  </div>

  <div v-else>
    <p>Chargement…</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TemplateService from '@/services/template.service.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const prestataire = ref(null)

function serviceName(id) {
  const mapping = {
    achat: 'Page d’achat',
    reservation: 'Réservation',
    planning: 'Planning',
    info: 'Page d’information'
  }
  return mapping[id] || id
}

onMounted(async () => {
  const res = await TemplateService.getPrestataireDemandes()
  if (res.error === 0) {
    prestataire.value = res.data.find(p => p.username === route.params.username) || {}
  }
})
</script>
