<template>
  <div class="prestataire">
    <div class="prestataire-container">
      <h2 class="prestataire-title">Modifier ma page prestataire</h2>

      <p v-if="!hasAccess" class="error">
        Vous n'avez pas accès à cette page
      </p>

      <form v-else class="prestataire-form">
        <div class="input-group">
          <label>Nom du service (visible au public)</label>
          <input v-model="form.name" placeholder="Entrez le nom de votre service" />
        </div>
        <div class="input-group">
          <label>Nom du service (anglais)</label>
          <input v-model="form.name_en" placeholder="Service name in English" />
        </div>


        <div class="input-group">
          <label>Email de contact</label>
          <input type="email" v-model="form.email" placeholder="exemple@mail.com" />
        </div>

        <div class="input-group">
          <label>Image du service (visible au public)</label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
          <div v-if="form.image">
            <img :src="form.image" :alt="form.name" class="preview-image" />
          </div>
        </div>

        <div class="input-group">
          <label>Description (visible au public)</label>
          <input v-model="form.shortDescription" />
        </div>
        <div class="input-group">
          <label>Description (anglais)</label>
          <input v-model="form.shortDescription_en" placeholder="Short description in English" />
        </div>

        

        <div class="input-group">
          <label>Choisissez vos services</label>
          <div v-for="s in availableServices" :key="s.id" class="service-item">
            <input type="checkbox" :id="s.id" :value="s.id" v-model="form.services" />
            <label :for="s.id">{{ s.name }}</label>
          </div>
        </div>

        <button type="button" class="btn-submit" @click="submitForm">
          Mettre à jour
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/stores/auth.js'
import TemplateService from '@/services/template.service.js'
import PrestataireService from '@/services/prestataire.service.js'

const auth = useAuth()

const hasAccess = ref(false)

const form = ref({
  name: '',
  name_en: '', 
  email: '',
  image: null,
  shortDescription: '',
  shortDescription_en: '',
  services: [],
  username: auth.authUser?.username || ''
})

const availableServices = ref([
  { id: 'achat', name: 'Page d’achat' },
  { id: 'planning', name: 'Planning' },
  { id: 'info', name: 'Page d’information' }
])

async function submitForm() {
  const res = await PrestataireService.updatePrestataire(form.value)
  window.location.reload()
  if (res.error === 0) {
    alert('Page prestataire mise à jour')
  }
}

onMounted(async () => {
  const res = await TemplateService.getTemplates()
  if (res.error === 0) {
    const p = res.data.find(
      p => p.username === auth.authUser?.username && p.type === 'prestataireValide'
    )
    if (p) {
      hasAccess.value = true
      form.value = {
        name: p.name,
        name_en: p.name_en || p.name, 
        email: p.email || '',
        image: p.image || null,
        shortDescription: p.shortDescription || '',
        shortDescription_en: p.shortDescription_en || p.shortDescription, 
        services: p.services || [],
        username: p.username
      }
    }
  }
})

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  form.value.image = await convertFileToBase64(file)
}
</script>

<style scoped>
.prestataire { position: fixed; top:0; left:0; width:100%; height:100vh; display:flex; justify-content:center; align-items:center; background: linear-gradient(to right, #5858d8, #0080ff); z-index:0; }
.prestataire-container { background:white; padding:40px 60px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; }
.prestataire-title { font-size:24px; font-weight:bold; margin-bottom:20px; color:#0000f5; }
.prestataire-form { width:100%; display:flex; flex-direction:column; gap:16px; }
.input-group { display:flex; flex-direction:column; }
.input-group label { font-weight:600; margin-bottom:5px; color:#333; }
.input-group input { border:1px solid #ccc; border-radius:8px; padding:10px; font-size:14px; }
.btn-submit { background:#0000f5; color:white; font-weight:600; padding:10px; border:none; border-radius:8px; cursor:pointer; }
.btn-submit:hover { background:#2828e2; }
.service-item { display:flex; align-items:center; gap:10px; }
.preview-image { max-width:200px; margin-top:10px; border-radius:8px; }
.error { color:red; font-weight:600; }
</style>
