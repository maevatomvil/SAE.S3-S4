<template>
  <div class="demandes-container">
    <h1>Demandes de Prestations</h1>
    <div v-if="demandes.length === 0">
      Aucune demande pour le moment.
    </div>
    <div v-for="demande in demandes" :key="demande.id" class="demande-card">
      <h2>{{ demande.name }}</h2>
      <p><strong>Description courte :</strong> {{ demande.shortDescription }}</p>
      <p><strong>Titre de la page :</strong> {{ demande.pageTitle }}</p>
      <div v-if="demande.image">
        <img :src="demande.image" :alt="demande.name" class="demande-image"/>
      </div>
      <div v-if="demande.templateContent" class="template-content" v-html="demande.templateContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPrestataireDemandes } from '@/services/template.service.js'

const demandes = ref([])

onMounted(async () => {
  const res = await getPrestataireDemandes()
  if (res.error === 0) {
    demandes.value = res.data
  }
})
</script>

<style scoped>
.demandes-container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

.demande-card {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.demande-card h2 {
  margin-bottom: 10px;
}

.demande-image {
  max-width: 200px;
  margin-bottom: 10px;
}

.template-content {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
</style>
