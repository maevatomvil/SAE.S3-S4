<template>
  <div v-if="prestataire">
    <h1 style="text-align: center; margin-bottom: 20px;">
      {{ prestataire.pageTitle }}
    </h1>

    <div v-html="prestataire.templateContent"></div>
  </div>

  <div v-else>
    <h3>Cette page n'existe plus</h3>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TemplateService from '@/services/template.service.js'

const route = useRoute()
const prestataire = ref(null)

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  if (res.error === 0) {
    prestataire.value = res.data.find(
      p => p.username === route.params.username &&
           p.type === 'prestataireValide'
    ) || null
  }

  if (prestataire.value) {
    const key = "views_" + prestataire.value.username
    const vues = JSON.parse(localStorage.getItem(key) || "[]")
    const today = new Date().toLocaleDateString()

    const v = vues.find(v => v.date === today)
    v ? v.count++ : vues.push({ date: today, count: 1 })

    localStorage.setItem(key, JSON.stringify(vues))
  }
})
</script>
