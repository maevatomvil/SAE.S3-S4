<template>
  <div class="prestataire">
    <div class="prestataire-container">
      <h2 class="prestataire-title"> {{ isEnglish ? "Become a Vendor" : "Devenir Prestataire" }}</h2>
       <span v-if="!isEnglish"> Important : un utilisateur ne peut posséder qu’une seule page prestataire à la fois. <br>Si une demande est déjà en attente la nouvelle ne sera pas prise en compte. </span> <span v-else> Important: a user can only own one vendor page at a time. <br>If a request is already pending, the new one will not be considered. </span>
      <br>
      <form @submit.prevent="handleSubmit" class="prestataire-form">

        <div class="input-group">
          <label>{{ isEnglish ? "Service name (public)" : "Nom du service (sera visible au public)" }}</label>
          <input v-model="form.name" :placeholder="isEnglish ? 'Enter your service name' : 'Entrez le nom de votre service'" required />
        </div>
        <div class="input-group"> <label>{{ isEnglish ? "Service name (English)" : "Nom du service (anglais)" }}</label> <input v-model="form.name_en" placeholder="Enter your service name in English" /> </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Contact email" : "Email de contact" }}</label>
          <input type="email" v-model="form.email" :placeholder="isEnglish ? 'example@mail.com' : 'exemple@mail.com'" required />
        </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Service image (public)" : "Image du service (sera visible au public)" }}</label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
        </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Description (public)" : "Description (sera visible au public)" }}</label>
          <input v-model="form.shortDescription" :placeholder="isEnglish ? 'Short description' : 'Paragraphe affiché sur votre page'" required />
        </div>
        <div class="input-group"> <label>{{ isEnglish ? "Description (English)" : "Description (anglais)" }}</label><input v-model="form.shortDescription_en" placeholder="Short description in English" /> </div>

        <div class="input-group">
          <label>{{ isEnglish ? "Choose your services" : "Choisissez vos services" }}</label>

          <div v-for="s in availableServices" :key="s.id" class="service-item">
            <input type="checkbox" :id="s.id" :value="s.id" v-model="form.services" />
            <label :for="s.id">{{ s.name }}</label>

            <button
              v-if="form.services.includes(s.id)"
              type="button"
              class="btn-template"
              @click="openTemplate(s.id)">
               {{ isEnglish ? "Open template" : "Accéder au template" }}
            </button>
          </div>
        </div>
        <div class="input-group">
          <label>{{ isEnglish ? "Desired building" : "Emplacement désiré" }}</label>
          <div style="height:800px">
            <MapSelectPlace v-model="form.locationNeeds" />
          </div>
        </div>

        <button type="submit" class="btn-submit">
          {{ isEnglish ? "Submit request" : "Envoyer la demande" }}
        </button>


        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <h5>
        {{ isEnglish
          ? "⏳ Your request will be reviewed within 24 hours. You will be notified by email."
          : "⏳ Votre demande sera examinée sous 24 heures. Vous serez informé par e-mail."
        }}
      </h5>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import TemplateService from '@/services/template.service'
import { useAuth } from '@/stores/auth.js'
import { useLanguageStore } from '@/stores/languageStore.js'
import MapSelectPlace from '@/views/MapSelectPlace.vue'

const auth = useAuth()
const router = useRouter()
const languageStore = useLanguageStore()
const isEnglish = computed(() => languageStore.isEnglish)

const form = ref({
  name: '',
  name_en: '', 
  email: '',
  image: null,
  shortDescription: '',
  shortDescription_en: '',
  services: [],
  username: auth.authUser?.username || '',
  locationNeeds: '',
})

const successMessage = ref('')
const errorMessage = ref('')

onMounted(() => {
  const savedForm = JSON.parse(localStorage.getItem('savedForm') || '{}')
  if (savedForm.name) form.value = savedForm
  if (!form.value.services) form.value.services = []
  form.value.username = auth.authUser?.username || ''
})

function handleFileUpload(event) {
  form.value.image = event.target.files[0]
}

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

async function handleSubmit() {
  if (!form.value.name || !form.value.shortDescription || !form.value.email) {
    errorMessage.value = isEnglish.value
      ? "All fields are required"
      : "Tous les champs sont obligatoires"
    return
  }

  if (!form.value.name_en) form.value.name_en = form.value.name
  if (!form.value.shortDescription_en) form.value.shortDescription_en = form.value.shortDescription

  form.value.username = auth.authUser?.username || ''

  try {
    const t = await TemplateService.getCurrentTemplate()

    if (form.value.services.includes('achat')) {
      form.value.pageTitleAchat = t.pageTitleAchat || ''
      form.value.pageDescriptionAchat = t.pageDescriptionAchat || ''
      form.value.articles = t.articles || []
    }

    if (form.value.services.includes('info')) {
      form.value.templateContent = t.content || ''
      form.value.pageTitle = t.pageTitle || ''
    }

    if (form.value.services.includes('planning')) {
      form.value.planning = t.planning || []
    }


    if (form.value.image && typeof form.value.image !== 'string') {
      form.value.image = await convertFileToBase64(form.value.image)
    }

    const result = await TemplateService.saveTemplate(form.value)

    if (result.error === 0) {
      successMessage.value = isEnglish.value
      ? "Form submitted successfully!"
      : "Formulaire envoyé avec succès !"

      errorMessage.value = ''
      form.value = { name:'', email:'', image:null, shortDescription:'', services:[], username:'' }
      TemplateService.clearCurrentTemplate()
      localStorage.removeItem('savedForm')
    } else {
      errorMessage.value = result.data
      successMessage.value = ''
    }
  } catch (err) {
    errorMessage.value = isEnglish.value
    ? "Error while submitting the form"
    : "Erreur lors de l’envoi du formulaire"

    successMessage.value = ''
  }
}


const availableServices = computed(() => [
  {
    id: 'achat',
    name: isEnglish.value ? 'Shop page' : 'Page d’achat'
  },
  {
    id: 'planning',
    name: isEnglish.value ? 'Schedule' : 'Planning'
  },
  {
    id: 'info',
    name: isEnglish.value ? 'Information page' : 'Page d’information'
  }
])


function openTemplate(serviceId) {
  localStorage.setItem('savedForm', JSON.stringify(form.value))
  if (serviceId === 'achat') router.push('/AddAchats')
  else if (serviceId === 'planning') router.push('/AddPlanning')
  else if (serviceId === 'info') router.push('/PageInformation')
}
</script>

<style scoped>
.prestataire { display:flex; justify-content:center; align-items:center; background: linear-gradient(to right, #5858d8, #0080ff); z-index:0; }
.prestataire-container { width: 1200px; background:white; padding:40px 60px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; }
.prestataire-title { font-size:24px; font-weight:bold; margin-bottom:20px; color:#0000f5; }
.prestataire-form { width:100%; display:flex; flex-direction:column; gap:16px; }
.input-group { display:flex; flex-direction:column; }
.input-group label { font-weight:600; margin-bottom:5px; color:#333; }
.input-group input { border:1px solid #ccc; border-radius:8px; padding:10px; font-size:14px; }
.btn-submit { background:#0000f5; color:white; font-weight:600; padding:10px; border:none; border-radius:8px; cursor:pointer; }
.btn-submit:hover { background:#2828e2; }
.success { color:green; font-size:14px; text-align:center; margin-top:10px; }
.error { color:red; font-size:14px; text-align:center; margin-top:10px; }
.service-item { display:flex; align-items:center; gap:10px; }
.btn-template { background:#0000f5; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; }
.btn-template:hover { background:#2828e2; }
</style>
